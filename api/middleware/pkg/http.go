package pkg

import "net/http"

type httpClient interface {
	Get(url string) (resp *http.Response, err error)
}

type client struct {
	*http.Client
}
var _ httpClient = (*client)(nil)

func getHTTPClient() httpClient {
	return http.DefaultClient
}