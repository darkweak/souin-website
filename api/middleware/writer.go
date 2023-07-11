package middleware

import (
	"bytes"
	"net/http"
)

type middlewareWriter struct {
	http.ResponseWriter
	body   *bytes.Buffer
	status int
}

func newWriter(rw http.ResponseWriter) *middlewareWriter {
	return &middlewareWriter{
		ResponseWriter: rw,
		body:           bytes.NewBuffer([]byte{}),
		status:         200,
	}
}

func (w *middlewareWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func (w *middlewareWriter) WriteHeader(status int) {
	w.status = status
	w.ResponseWriter.WriteHeader(status)
}
