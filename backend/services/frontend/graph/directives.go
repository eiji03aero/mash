package graph

import (
	"context"
	"fmt"

	"frontend"
	"frontend/graph/generated"

	"github.com/99designs/gqlgen/graphql"
)

type directiveImpl struct {
	service frontend.Service
}

func installDirectives(
	config *generated.Config,
	svc frontend.Service,
) {
	d := &directiveImpl{
		service: svc,
	}

	config.Directives.Auth = d.Auth
}

func (d *directiveImpl) Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (res interface{}, err error) {
	if !IsAuthenticated(ctx) {
		err = fmt.Errorf("you have to be logged in for this feature")
		return
	}

	return next(ctx)
}
