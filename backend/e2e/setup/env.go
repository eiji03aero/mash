package setup

import (
	"github.com/kelseyhightower/envconfig"
)

var Env Environment

func init() {
	envconfig.Process("", &Env)
}

type Environment struct {
	GRAPHQL_HTTP_URL string `required:"true"`
}
