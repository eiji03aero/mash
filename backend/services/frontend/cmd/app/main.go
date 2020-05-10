package main

import (
	"log"
	"net/http"
	"strings"

	httpadapter "frontend/adapter/http"
	authpxy "frontend/adapter/proxy/auth"
	authquerypxy "frontend/adapter/proxy/authquery"
	"frontend/graph"
	frontendsvc "frontend/service"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/go-redis/redis"
)

func main() {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     env.REDIS_HOST + ":" + env.REDIS_PORT,
		Password: "",
		DB:       0,
	})
	_, err := redisClient.Ping().Result()
	if err != nil {
		panic(err)
	}

	rabbitmqOption := rabbitmq.Option{
		Host: env.RABBITMQ_HOST,
		Port: env.RABBITMQ_PORT,
	}
	eb, err := rabbitmq.NewClient(rabbitmqOption)
	if err != nil {
		panic(err)
	}

	authProxy := authpxy.New(eb)
	authQueryProxy := authquerypxy.New(eb)

	svc := frontendsvc.New(
		authProxy,
		authQueryProxy,
	)

	gqlServer := graph.NewServer(
		redisClient,
		svc,
		authProxy,
		authQueryProxy,
	)

	router := httpadapter.NewRouter(
		svc,
		strings.Split(env.CORS_ORIGINS, ","),
		strings.Split(env.CORS_ALLOWED_HEADERS, ","),
		gqlServer,
	)

	host := env.HOST + ":" + env.PORT
	log.Printf("connect to http://%s/ for GraphQL playground", host)
	log.Fatal(http.ListenAndServe(host, router))
}
