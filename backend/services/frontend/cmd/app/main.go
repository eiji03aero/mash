package main

import (
	"log"
	"net/http"
	"time"

	"frontend/graph"
	"frontend/graph/generated"
	"frontend/service"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/go-redis/redis"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

func main() {
	_ = service.New()

	redisClient := redis.NewClient(&redis.Options{
		Addr:     env.REDIS_HOST,
		Password: "",
		DB:       0,
	})
	_, err := redisClient.Ping().Result()
	if err != nil {
		panic(err)
	}

	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:8090",
		},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	resolver := graph.NewResolver(redisClient)
	go resolver.StartSubscribingRedis()

	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))
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

	router.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	router.Handle("/graphql", srv)

	log.Printf("connect to http://%s:%s/ for GraphQL playground", env.HOST, env.PORT)
	log.Fatal(http.ListenAndServe(env.HOST+":"+env.PORT, router))
}
