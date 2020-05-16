package main

import (
	"github.com/kelseyhightower/envconfig"
)

func init() {
	var env Env
	envconfig.Process("", &env)
}

type Env struct {
	PORT string
}