package consumer

import (
	"encoding/json"

	"authquery/domain"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
	"github.com/eiji03aero/mskit/utils/logger"
	"github.com/streadway/amqp"
)

func (c *consumer) runAuthUserCreated() {
	c.client.NewConsumer().
		Configure(
			rabbitmq.TopicConsumerOption{
				ExchangeName: "topic-auth",
				RoutingKey:   "auth.event.user-created",
			},
		).
		OnDelivery(func(d amqp.Delivery) {
			user := &domain.User{}
			err := json.Unmarshal(d.Body, user)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserCreated, err)
				return
			}

			err = c.service.CreateUser(user)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserCreated, err)
				return
			}

			return
		}).
		Exec()
}
