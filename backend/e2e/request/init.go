package request

import (
	"e2e/setup"

	"github.com/machinebox/graphql"
)

var (
	client *graphql.Client
)

func init() {
	client = graphql.NewClient(setup.Env.GRAPHQL_HTTP_URL)
}
