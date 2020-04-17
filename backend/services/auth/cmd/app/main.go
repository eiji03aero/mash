package main

import (
	authquerypxy "auth/adapter/proxy/authquery"
	"auth/adapter/publisher"
	"auth/adapter/rpcendpoint"
	userent "auth/domain/entity/user"
	authsvc "auth/service"

	"github.com/eiji03aero/mskit"
	"github.com/eiji03aero/mskit/db/mongo"
	"github.com/eiji03aero/mskit/db/mongo/eventstore"
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

	er := mskit.NewEventRegistry()
	er.Set(userent.UserCreated{})
	er.Set(userent.UserLoggedIn{})

	es, err := eventstore.New(dbOption, er)
	if err != nil {
		panic(err)
	}

	eb, err := rabbitmq.NewClient(rabbitmqOption)
	if err != nil {
		panic(err)
	}

	authQueryProxy := authquerypxy.New(eb)

	svc := authsvc.New(
		mskit.NewEventRepository(es, publisher.New(eb)),
		authQueryProxy,
	)

	err = rpcendpoint.New(eb, svc).Run()
	if err != nil {
		panic(err)
	}

	logger.Println("server starting to listen ...")
	bff := make(chan bool, 1)
	<-bff
	logger.Println(authQueryProxy)
}
