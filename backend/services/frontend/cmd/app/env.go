package main

import (
	"github.com/kelseyhightower/envconfig"
)

var env Env

func init() {
	envconfig.Process("", &env)
}

type Env struct {
	PORT       string `default:"3000"`
	HOST       string `default:"localhost"`
	REDIS_HOST string `required:"true"`
}
