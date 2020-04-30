package http

import (
	"context"
	"net/http"

	"frontend/utils"
)

const (
	bearerPrefix = "Bearer "
)

func injectHTTPMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			httpContext := utils.HttpContext{
				W: &w,
				R: r,
			}

			ctx := context.WithValue(r.Context(), "httpContext", httpContext)

			auth := r.Header.Get("Authentication")
			if len(auth) > len(bearerPrefix) {
				token := auth[len(bearerPrefix):]
				ctx = context.WithValue(ctx, "token", token)
			}

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
