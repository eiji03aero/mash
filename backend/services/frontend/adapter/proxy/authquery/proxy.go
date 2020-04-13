package authquery

import (
	"encoding/json"
	"frontend"
	"frontend/graph/model"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/streadway/amqp"
)

type proxy struct {
	client *rabbitmq.Client
}

func New(c *rabbitmq.Client) frontend.AuthQueryProxy {
	return &proxy{
		client: c,
	}
}

func (p *proxy) LoadUsers() (users []*model.User, err error) {
	delivery, err := p.client.NewRPCClient().
		Configure(
			rabbitmq.PublishArgs{
				RoutingKey: "authquery.rpc.load-users",
				Publishing: amqp.Publishing{},
			},
		).
		Exec()
	if err != nil {
		return
	}

	err = json.Unmarshal(delivery.Body, &users)
	if err != nil {
		return
	}

	return
}
