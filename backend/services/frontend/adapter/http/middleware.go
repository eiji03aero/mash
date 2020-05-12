package http

import (
	"context"
	"net/http"

	"frontend"
	"frontend/domain"
	"frontend/graph"
)

const (
	bearerPrefix = "Bearer "
)

func injectHTTPMiddleware(svc frontend.Service) func(http.Handler) http.Handler {
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
