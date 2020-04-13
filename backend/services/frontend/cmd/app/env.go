package main

import (
	"github.com/kelseyhightower/envconfig"
)

var env Env

func init() {
	envconfig.Process("", &env)
}

type Env struct {
	PORT          string `required:"true"`
	HOST          string `required:"true"`
	REDIS_HOST    string `required:"true"`
	REDIS_PORT    string `required:"true"`
	RABBITMQ_PORT string `required:"true"`
	RABBITMQ_HOST string `required:"true"`
	CORS_ORIGINS  string `required:"true"`
}
