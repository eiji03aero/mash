package main

import (
	"github.com/kelseyhightower/envconfig"
)

var env Env

func init() {
	envconfig.Process("", &env)
}

type Env struct {
	HOST          string `required:"true"`
	PORT          string `required:"true"`
	DB_HOST       string `required:"true"`
	DB_PORT       string `required:"true"`
	RABBITMQ_HOST string `required:"true"`
	RABBITMQ_PORT string `required:"true"`
}
