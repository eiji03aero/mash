package request

import (
	"context"
	"time"

	"e2e/env"

	"github.com/machinebox/graphql"
)

var (
	client *graphql.Client
)

func init() {
	client = graphql.NewClient(env.Env.GRAPHQL_HTTP_URL)
}

func withRequestContext(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, 30*time.Second)
}

func requestContext() context.Context {
	ctx, _ := withRequestContext(context.Background())
	return ctx
}
