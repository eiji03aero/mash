package authquery

import (
	"encoding/json"

	"auth"
	"auth/domain"
	userent "auth/domain/entity/user"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/streadway/amqp"
)

type proxy struct {
	client *rabbitmq.Client
}

func New(c *rabbitmq.Client) auth.AuthQueryProxy {
	return &proxy{
		client: c,
	}
}

func (p *proxy) LoadUsers() (users []*userent.User, err error) {
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

func (p *proxy) LoadUserByName(name string) (user *userent.User, err error) {
	bodyJson, err := json.Marshal(map[string]interface{}{
		"name": name,
	})
	if err != nil {
		return
	}

	delivery, err := p.client.NewRPCClient().
		Configure(
			rabbitmq.PublishArgs{
				RoutingKey: "authquery.rpc.load-user-by-name",
				Publishing: amqp.Publishing{
					Body: bodyJson,
				},
			},
		).
		Exec()
	if rabbitmq.IsNotFoundResponse(delivery) {
		err = domain.ErrDataNotFound
		return
	}
	if err != nil {
		return
	}

	user = &userent.User{}
	err = json.Unmarshal(delivery.Body, user)
	if err != nil {
		return
	}

	return
}
