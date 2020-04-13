package main

import (
	"authquery/adapter/consumer"
	repo "authquery/adapter/repository"
	"authquery/adapter/rpcendpoint"
	authsvc "authquery/service"

	"github.com/eiji03aero/mskit/db/mongo"
	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/eiji03aero/mskit/utils/logger"
)

func main() {
	dbOption := mongo.DBOption{
		Host: env.DB_HOST,
		Port: env.DB_PORT,
	}
	rabbitmqOption := rabbitmq.Option{
		Host: env.RABBITMQ_HOST,
		Port: env.RABBITMQ_PORT,
	}

	mongoClient, err := mongo.GetClient(dbOption)
	if err != nil {
		panic(err)
	}

	repository := repo.New(mongoClient)

	eb, err := rabbitmq.NewClient(rabbitmqOption)
	if err != nil {
		panic(err)
	}

	svc := authsvc.New(
		repository,
	)

	err = rpcendpoint.New(eb, svc).Run()
	if err != nil {
		panic(err)
	}

	err = consumer.New(eb, svc).Run()
	if err != nil {
		panic(err)
	}

	logger.Println("server starting to listen ...")
	bff := make(chan bool, 1)
	<-bff
}
