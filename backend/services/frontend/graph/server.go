package graph

import (
	"net/http"
	"time"

	frontendroot "frontend"
	"frontend/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/go-redis/redis"
	"github.com/gorilla/websocket"
)

func NewServer(
	redisClient *redis.Client,
	apxy frontendroot.AuthProxy,
	aqpxy frontendroot.AuthQueryProxy,
) *handler.Server {
	resolver := NewResolver(
		redisClient,
		apxy,
		aqpxy,
	)
	go resolver.StartSubscribingRedis()

	schema := generated.NewExecutableSchema(generated.Config{
		Resolvers: resolver,
	})

	srv := handler.New(schema)
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})
	srv.AddTransport(transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	})

	return srv
}
