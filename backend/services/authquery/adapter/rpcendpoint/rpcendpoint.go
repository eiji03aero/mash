package rpcendpoint

import (
	"encoding/json"

	"authquery"
	"authquery/domain"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/streadway/amqp"
)

type rpcEndpoint struct {
	client  *rabbitmq.Client
	service authquery.Service
}

func New(c *rabbitmq.Client, svc authquery.Service) *rpcEndpoint {
	return &rpcEndpoint{
		client:  c,
		service: svc,
	}
}

func (re *rpcEndpoint) Run() (err error) {
	go re.runLoadUsers()
	go re.runLoadUser()
	return
}

func (re *rpcEndpoint) runLoadUsers() {
	re.client.NewRPCEndpoint().
		Configure(
			rabbitmq.QueueOption{
				Name: "authquery.rpc.load-users",
			},
		).
		OnDelivery(func(_ amqp.Delivery) (p amqp.Publishing) {
			users, err := re.service.LoadUsers()
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			usersJson, err := json.Marshal(users)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			p.Body = usersJson

			return rabbitmq.MakeSuccessResponse(p)
		}).
		Exec()
}

func (re *rpcEndpoint) runLoadUser() {
	re.client.NewRPCEndpoint().
		Configure(
			rabbitmq.QueueOption{
				Name: "authquery.rpc.load-user",
			},
		).
		OnDelivery(func(d amqp.Delivery) (p amqp.Publishing) {
			requestBody := map[string]interface{}{}

			err := json.Unmarshal(d.Body, &requestBody)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			user, err := re.service.LoadUser(requestBody)
			if err == domain.ErrDataNotFound {
				return rabbitmq.MakeNotFoundResponse(p, err)
			} else if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			userJson, err := json.Marshal(user)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			p.Body = userJson

			return rabbitmq.MakeSuccessResponse(p)
		}).
		Exec()
}
