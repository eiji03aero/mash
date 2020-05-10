package publisher

import (
	"encoding/json"

	userent "auth/domain/entity/user"

	"github.com/eiji03aero/mskit"
	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/eiji03aero/mskit/utils/errbdr"
	"github.com/streadway/amqp"
)

type publisher struct {
	client *rabbitmq.Client
}

func New(c *rabbitmq.Client) mskit.EventPublisher {
	return &publisher{
		client: c,
	}
}

func (p *publisher) Publish(event interface{}) (err error) {
	ej, err := json.Marshal(event)
	if err != nil {
		return
	}

	option := rabbitmq.TopicPublisherOption{
		ExchangeName: "topic-auth",
		RoutingKey:   "",
		Publishing: amqp.Publishing{
			Body: ej,
		},
	}

	switch e := event.(type) {
	case userent.UserCreated:
		option.RoutingKey = "auth.event.user-created"

	case userent.UserLoggedIn:
		option.RoutingKey = "auth.event.user-logged-in"

	case userent.UserLoggedOut:
		option.RoutingKey = "auth.event.user-logged-out"

	default:
		return errbdr.NewErrUnknownParams(p.Publish, e)
	}

	return p.client.NewPublisher().
		Configure(option).
		Exec()
}
