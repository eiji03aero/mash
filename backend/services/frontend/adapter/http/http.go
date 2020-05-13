package http

import (
	"frontend"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/rs/cors"
)

func NewRouter(
	service frontend.Service,
	corsOrigins []string,
	corsAllowedHeaders []string,
	gqlServer *handler.Server,
) *chi.Mux {
	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		AllowedOrigins:   corsOrigins,
		AllowedHeaders:   corsAllowedHeaders,
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	router.Use(createContextMiddleware(service))
	router.Use(createLogMiddleware())

	router.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	router.Handle("/graphql", gqlServer)

	return router
}
