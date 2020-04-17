package rpcendpoint

import (
	"encoding/json"

	"auth"
	userent "auth/domain/entity/user"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/streadway/amqp"
)

type rpcEndpoint struct {
	client  *rabbitmq.Client
	service auth.Service
}

func New(c *rabbitmq.Client, svc auth.Service) *rpcEndpoint {
	return &rpcEndpoint{
		client:  c,
		service: svc,
	}
}

func (re *rpcEndpoint) Run() (err error) {
	go re.runCreateUser()
	go re.runLoginUser()
	return
}

func (re *rpcEndpoint) runCreateUser() {
	re.client.NewRPCEndpoint().
		Configure(
			rabbitmq.QueueOption{
				Name: "auth.rpc.create-user",
			},
		).
		OnDelivery(func(d amqp.Delivery) (p amqp.Publishing) {
			cmd := userent.CreateUser{}
			err := json.Unmarshal(d.Body, &cmd)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			userA, err := re.service.CreateUser(cmd)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			userJson, err := json.Marshal(userA)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			p.Body = userJson

			return rabbitmq.MakeSuccessResponse(p)
		}).
		Exec()
}

func (re *rpcEndpoint) runLoginUser() {
	re.client.NewRPCEndpoint().
		Configure(
			rabbitmq.QueueOption{
				Name: "auth.rpc.login-user",
			},
		).
		OnDelivery(func(d amqp.Delivery) (p amqp.Publishing) {
			cmd := userent.LoginUser{}
			err := json.Unmarshal(d.Body, &cmd)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			token, err := re.service.LoginUser(cmd)
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			responseJson, err := json.Marshal(map[string]interface{}{
				"token": token,
			})
			if err != nil {
				return rabbitmq.MakeFailResponse(p, err)
			}

			p.Body = responseJson

			return rabbitmq.MakeSuccessResponse(p)
		}).
		Exec()
}
