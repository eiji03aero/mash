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

func (c *consumer) runAuthUserLoggedIn() {
	c.client.NewConsumer().
		Configure(
			rabbitmq.TopicConsumerOption{
				ExchangeName: "topic-auth",
				RoutingKey:   "auth.event.user-logged-in",
			},
		).
		OnDelivery(func(d amqp.Delivery) {
			body := struct {
				Id    string `json:"id"`
				Token string `json:"token"`
			}{}
			err := json.Unmarshal(d.Body, &body)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedIn, err)
				return
			}

			user, err := c.service.LoadUser(map[string]interface{}{
				"id": body.Id,
			})
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedIn, err)
				return
			}

			user.Token = body.Token

			err = c.service.UpdateUser(user)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedIn, err)
				return
			}

			return
		}).
		Exec()
}

func (c *consumer) runAuthUserLoggedOut() {
	c.client.NewConsumer().
		Configure(
			rabbitmq.TopicConsumerOption{
				ExchangeName: "topic-auth",
				RoutingKey:   "auth.event.user-logged-out",
			},
		).
		OnDelivery(func(d amqp.Delivery) {
			body := struct {
				Id string `json:"id"`
			}{}
			err := json.Unmarshal(d.Body, &body)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedOut, err)
				return
			}

			user, err := c.service.LoadUser(map[string]interface{}{
				"id": body.Id,
			})
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedIn, err)
				return
			}

			user.Token = ""

			err = c.service.UpdateUser(user)
			if err != nil {
				logger.PrintFuncError(c.runAuthUserLoggedIn, err)
				return
			}

			return
		}).
		Exec()
}
