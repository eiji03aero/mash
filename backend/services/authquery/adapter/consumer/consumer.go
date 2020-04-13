package consumer

import (
	"authquery"

	"github.com/eiji03aero/mskit/eventbus/rabbitmq"
)

type consumer struct {
	client  *rabbitmq.Client
	service authquery.Service
}

func New(c *rabbitmq.Client, svc authquery.Service) *consumer {
	return &consumer{
		client:  c,
		service: svc,
	}
}

func (c *consumer) Run() error {
	go c.runAuthUserCreated()

	return nil
}
