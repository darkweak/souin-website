package middleware

import (
	"encoding/json"
	"io"
	"net/http"
	"souin_middleware/pkg"
	"strings"

	"github.com/caddyserver/caddy/v2"
	"github.com/caddyserver/caddy/v2/caddyconfig/caddyfile"
	"github.com/caddyserver/caddy/v2/caddyconfig/httpcaddyfile"
	"github.com/caddyserver/caddy/v2/modules/caddyhttp"
	"go.uber.org/zap"
)

const moduleName = "souin_middleware_handler"

func init() {
	caddy.RegisterModule(Middleware{})
	httpcaddyfile.RegisterGlobalOption(moduleName, func(_ *caddyfile.Dispenser, _ any) (any, error) { return &Middleware{}, nil })
	httpcaddyfile.RegisterHandlerDirective(moduleName, func(_ httpcaddyfile.Helper) (caddyhttp.MiddlewareHandler, error) { return &Middleware{}, nil })
}

type Middleware struct {
	logger  *zap.Logger
	checker *pkg.CheckerChain
}

func (Middleware) CaddyModule() caddy.ModuleInfo {
	return caddy.ModuleInfo{
		ID:  "http.handlers.souin_middleware_handler",
		New: func() caddy.Module { return new(Middleware) },
	}
}

func isCandidateToAdd(path, method string, status int) bool {
	return ((status == http.StatusOK && method == http.MethodPatch) || (method == http.MethodPost && status == http.StatusCreated)) && 
		strings.Contains(path, "/configurations")
}

func isCandidateToDel(path, method string, status int) bool {
	return status == http.StatusNoContent && method == http.MethodDelete && strings.Contains(path, "/domains")
}

type creationPayload struct {
	Id            string `json:"@id"`
	Zone          string `json:"zone"`
	IP            string `json:"ip"`
	Configuration string `json:"configuration"`

	Domain struct {
		Dns string `json:"dns"`
		Id  string `json:"@id"`
	} `json:"domain"`
}

func (s *Middleware) handleAPI(rw http.ResponseWriter, r *http.Request) bool {
	if r.URL.Path == "/middleware/debug/deployer" {
		if r.Method == http.MethodGet {
			var value map[string]string
			s.checker.Map.Range(func (k, v any) bool {
				value[k.(string)] = v.(string)
				return true
			})

			b, _ := json.Marshal(value)
			rw.Header().Set("Content-Type", "application/json")
			rw.WriteHeader(http.StatusOK)
			rw.Write(b)
			return true
		}

		if r.Method == http.MethodDelete {
			var body map[string]string
			if v, err := io.ReadAll(r.Body); err == nil {
				if err := json.Unmarshal(v, &body); err == nil {
					s.checker.Map.Delete(body["key"])
					return true
				}
			}
		}
	}

	return false
}

func (s *Middleware) ServeHTTP(rw http.ResponseWriter, r *http.Request, next caddyhttp.Handler) error {
	if s.handleAPI(rw, r) {
	s.logger.Debug("Internal API can handle")
		return nil
	}
	s.logger.Debug("Internal API cannot handle")

	method := r.Method
	mrw := newWriter(rw)
	if err := next.ServeHTTP(mrw, r); err != nil {
		s.logger.Debug("ServeHTTP returned an error")
		return err
	}

	path := r.URL.Path
	s.logger.Sugar().Debugf("Is candidate to add %v", isCandidateToAdd(path, method, mrw.status))
	if isCandidateToAdd(path, method, mrw.status) {
		var domain creationPayload
		if err := json.Unmarshal(mrw.body.Bytes(), &domain); err != nil {
			s.logger.Sugar().Debugf("Error while unmarshaling %#v", err)
			return nil
		}

		root := domain.Domain.Dns
		id := domain.Domain.Id
		sub := domain.Zone
		ip := domain.IP

		if root == "" {
			s.logger.Sugar().Debugf("The root domain is empty %+v", domain)
			return nil
		}

		s.checker.Add(id, root, sub, ip)

		return nil
	}

	s.logger.Sugar().Debugf("Is candidate to del %v", isCandidateToAdd(path, method, mrw.status))
	if isCandidateToDel(path, method, mrw.status) {
		s.checker.Del(path)

		return nil
	}

	return nil
}

func (s *Middleware) Provision(ctx caddy.Context) error {
	s.logger = ctx.Logger(s)
	s.logger.Debug("Start middleware provisioning")
	s.checker = pkg.NewCheckerChain(s.logger)
	domains := pkg.RetrieveDomains(s.logger)

	for _, domain := range domains {
		for _, sub := range domain.Configurations {
			s.checker.Add(domain.Id, domain.Dns, sub.Zone, sub.IP)
		}
	}

	return nil
}

func (s *Middleware) UnmarshalCaddyfile(_ *caddyfile.Dispenser) error {
	return nil
}

var (
	_ caddy.Provisioner           = (*Middleware)(nil)
	_ caddyhttp.MiddlewareHandler = (*Middleware)(nil)
	_ caddyfile.Unmarshaler       = (*Middleware)(nil)
)
