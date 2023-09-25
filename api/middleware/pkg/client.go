package pkg

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"souin_middleware/pkg/api"
	"strings"
	"time"

	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
	"github.com/yookoala/gofast"
	"go.uber.org/zap"
)

const path = "php:9000"

const root = "/srv/app/public"
const scriptName = "/index.php"

var TRUSTED_MIDDLEWARE = os.Getenv("TRUSTED_MIDDLEWARE")

type envVars map[string]string

func buildEnv(r *http.Request) (envVars, error) {
	var env envVars

	// Separate remote IP and port; more lenient than net.SplitHostPort
	var ip, port string
	if idx := strings.LastIndex(r.RemoteAddr, ":"); idx > -1 {
		ip = r.RemoteAddr[:idx]
		port = r.RemoteAddr[idx+1:]
	} else {
		ip = r.RemoteAddr
	}

	// Remove [] from IPv6 addresses
	ip = strings.Replace(ip, "[", "", 1)
	ip = strings.Replace(ip, "]", "", 1)

	requestScheme := "http"
	if r.TLS != nil {
		requestScheme = "https"
	}

	reqHost, reqPort, err := net.SplitHostPort(r.Host)
	if err != nil {
		// whatever, just assume there was no port
		reqHost = r.Host
	}

	// Some variables are unused but cleared explicitly to prevent
	// the parent environment from interfering.
	env = envVars{
		// Variables defined in CGI 1.1 spec
		"AUTH_TYPE":         "", // Not used
		"GATEWAY_INTERFACE": "CGI/1.1",
		"REMOTE_ADDR":       ip,
		"REMOTE_HOST":       ip, // For speed, remote host lookups disabled
		"REMOTE_PORT":       port,
		"REMOTE_IDENT":      "", // Not used
		"REQUEST_METHOD":    r.Method,
		"REQUEST_SCHEME":    requestScheme,
		"SERVER_NAME":       reqHost,
		"SERVER_PROTOCOL":   r.Proto,

		// Other variables
		"DOCUMENT_ROOT":   root,
		"DOCUMENT_URI":    root,
		"HTTP_HOST":       TRUSTED_MIDDLEWARE, // added here, since not always part of headers
		"SCRIPT_FILENAME": caddyhttp.SanitizedPathJoin(root, scriptName),
		"SCRIPT_NAME":     scriptName,
	}

	if reqPort != "" {
		env["SERVER_PORT"] = reqPort
	} else if requestScheme == "http" {
		env["SERVER_PORT"] = "80"
	} else if requestScheme == "https" {
		env["SERVER_PORT"] = "443"
	}

	r.Header.Del("Authorization")
	// Add all HTTP headers to env variables
	for field, val := range r.Header {
		header := strings.ToUpper(field)
		env["HTTP_"+header] = strings.Join(val, ", ")
	}

	env["REQUEST_METHOD"] = strings.ToUpper(r.Method)

	return env, nil
}

type body struct {
	Valid bool `json:"valid"`
}

var payload, _ = json.Marshal(body{
	Valid: true,
})

func validateDomain(domainIRI string) map[string]api.Configuration {
	r, _ := http.NewRequest(http.MethodPatch, "/", nil)
	client, err := gofast.SimpleClientFactory(gofast.SimpleConnFactory("tcp", path))()
	if err != nil {
		return map[string]api.Configuration{}
	}

	reader := bytes.NewReader(payload)
	r.Method = http.MethodPatch
	r.Body = io.NopCloser(reader)
	rq := gofast.NewRequest(r)
	rq.Params, _ = buildEnv(r)
	rq.Params["REQUEST_URI"] = domainIRI
	rq.Params["CONTENT_TYPE"] = "application/merge-patch+json"
	rq.Params["CONTENT_LENGTH"] = fmt.Sprint(reader.Len())
	fmt.Println("validate domain", domainIRI)
	_, _ = client.Do(rq)

	domain := RetrieveDomain(domainIRI)

	subs := map[string]api.Configuration{}
	for _, sub := range domain.Configurations {
		subs[sub.Zone] = sub
	}

	return subs
}

type customRs struct {
	body   []byte
	status int
}

func (c *customRs) Write(b []byte) (int, error) {
	c.body = append(c.body, b...)

	return len(b), nil
}

func (c *customRs) Header() http.Header {
	return http.Header{}
}

func (c *customRs) WriteHeader(code int) {
	c.status = code
}

func getClient(maxRetry int, logger *zap.Logger) (gofast.Client, error) {
	client, err := gofast.SimpleClientFactory(gofast.SimpleConnFactory("tcp", path))()

	if err != nil {
		logger.Sugar().Debugf("Impossible to create a new CGI client: %#v", err)
		if maxRetry > 0 {
			time.Sleep(5*time.Second)
			logger.Debug("Try to get another one.")
			return getClient(maxRetry - 1, logger)
		}

		return nil, err
	}

	return client, nil
}

func RetrieveDomains(logger *zap.Logger) []api.Domain {
	r, _ := http.NewRequest(http.MethodGet, "/", nil)
	client, err := getClient(3, logger)
	if err != nil {
		return []api.Domain{}
	}

	rq := gofast.NewRequest(r)
	rq.Params, _ = buildEnv(r)
	rq.Params["REQUEST_URI"] = "/domains"
	rq.Params["QUERY_STRING"] = "valid=false"
	rq.Params["CONTENT_TYPE"] = "application/json"
	res, _ := client.Do(rq)

	var rs customRs
	_ = res.WriteTo(&rs, bytes.NewBuffer([]byte{}))

	var apiResult struct {
		Domains []api.Domain `json:"hydra:member"`
	}
	_ = json.Unmarshal(rs.body, &apiResult)
	logger.Sugar().Debugf("Retrieved %d unvalidated domains from the database.", len(apiResult.Domains))
	logger.Sugar().Debugf("%+v", apiResult.Domains)

	return apiResult.Domains
}

func RetrieveDomain(domainIRI string) api.Domain {
	r, _ := http.NewRequest(http.MethodGet, "/", nil)
	client, err := gofast.SimpleClientFactory(gofast.SimpleConnFactory("tcp", path))()
	if err != nil {
		return api.Domain{}
	}

	rq := gofast.NewRequest(r)
	rq.Params, _ = buildEnv(r)
	rq.Params["REQUEST_URI"] = domainIRI
	rq.Params["QUERY_STRING"] = "valid=false"
	rq.Params["CONTENT_TYPE"] = "application/json"
	res, _ := client.Do(rq)

	var rs customRs
	_ = res.WriteTo(&rs, bytes.NewBuffer([]byte{}))

	var apiResult api.Domain
	_ = json.Unmarshal(rs.body, &apiResult)

	return apiResult
}
