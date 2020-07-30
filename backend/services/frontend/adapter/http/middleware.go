package http

import (
	"bufio"
	"bytes"
	"context"
	"net"
	"net/http"

	"frontend"
	"frontend/domain"
	"frontend/graph"

	"github.com/eiji03aero/mskit/utils/logger"
)

const (
	bearerPrefix = "Bearer "
)

func createContextMiddleware(svc frontend.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			httpContext := domain.HTTPContext{
				W: &w,
				R: r,
			}

			ctx := context.WithValue(r.Context(), "httpContext", httpContext)

			auth := r.Header.Get("Authentication")
			if len(auth) > len(bearerPrefix) {
				token := auth[len(bearerPrefix):]

				user, err := svc.LoadUser(map[string]interface{}{
					"token": token,
				})
				if err != nil {
					http.Error(w, "invalid token", http.StatusForbidden)
					return
				}

				ctx = graph.WithContextUser(ctx, user)
			}

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

type bodyLogWriter struct {
	http.ResponseWriter
	body     *bytes.Buffer
	hijacker http.Hijacker
}

func (w *bodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}

func (w *bodyLogWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	return w.hijacker.Hijack()
}

func createLogMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			hijacker, _ := w.(http.Hijacker)
			wrappedWriter := &bodyLogWriter{
				ResponseWriter: w,
				body:           bytes.NewBuffer([]byte{}),
				hijacker:       hijacker,
			}
			next.ServeHTTP(wrappedWriter, r)

			logger.Println(
				logger.HiBlueString("Response body"),
				wrappedWriter.body.String(),
			)
		})
	}
}
