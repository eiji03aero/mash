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

	switch e := event.(type) {
	case userent.UserCreated:
		return p.publishUserCreated(ej)
	default:
		return errbdr.NewErrUnknownParams(p.Publish, e)
	}
}

func (p *publisher) publishUserCreated(eventJson []byte) (err error) {
	return p.client.NewPublisher().
		Configure(
			rabbitmq.TopicPublisherOption{
				ExchangeName: "topic-auth",
				RoutingKey:   "auth.event.user-created",
				Publishing: amqp.Publishing{
					Body: eventJson,
				},
			},
		).
		Exec()
}