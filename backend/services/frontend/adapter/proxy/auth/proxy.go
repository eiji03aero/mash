package auth

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

func New(c *rabbitmq.Client) frontend.AuthProxy {
	return &proxy{
		client: c,
	}
}

func (p *proxy) CreateUser(input model.ISignup) (user *model.User, err error) {
	bodyJson, err := json.Marshal(input)
	if err != nil {
		return
	}

	delivery, err := p.client.NewRPCClient().
		Configure(
			rabbitmq.PublishArgs{
				RoutingKey: "auth.rpc.create-user",
				Publishing: amqp.Publishing{
					Body: bodyJson,
				},
			},
		).
		Exec()
	if err != nil {
		return
	}

	responseBody := struct {
		User struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		} `json:"user"`
	}{}

	err = json.Unmarshal(delivery.Body, &responseBody)
	if err != nil {
		return
	}

	user = &model.User{
		ID:   responseBody.User.Id,
		Name: responseBody.User.Name,
	}

	return
}

func (p *proxy) LoginUser(input model.ILogin) (token string, err error) {
	bodyJson, err := json.Marshal(input)
	if err != nil {
		return
	}

	delivery, err := p.client.NewRPCClient().
		Configure(
			rabbitmq.PublishArgs{
				RoutingKey: "auth.rpc.login-user",
				Publishing: amqp.Publishing{
					Body: bodyJson,
				},
			},
		).
		Exec()
	if err != nil {
		return
	}

	responseBody := struct {
		Token string `json:"token"`
	}{}

	err = json.Unmarshal(delivery.Body, &responseBody)
	if err != nil {
		return
	}

	token = responseBody.Token

	return
}

func (p *proxy) LogoutUser(id string) (err error) {
	bodyJson, err := json.Marshal(map[string]interface{}{
		"id": id,
	})
	if err != nil {
		return
	}

	_, err = p.client.NewRPCClient().
		Configure(
			rabbitmq.PublishArgs{
				RoutingKey: "auth.rpc.logout-user",
				Publishing: amqp.Publishing{
					Body: bodyJson,
				},
			},
		).
		Exec()
	if err != nil {
		return
	}

	return
}
