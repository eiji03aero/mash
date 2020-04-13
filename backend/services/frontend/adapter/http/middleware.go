package http

import (
	"context"
	"net/http"

	"frontend/utils"
)

func injectHTTPMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			httpContext := utils.HttpContext{
				W: &w,
				R: r,
			}

			ctx := context.WithValue(r.Context(), "httpContext", httpContext)

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
