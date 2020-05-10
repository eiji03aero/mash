package graph

import (
	"context"
	"fmt"

	"frontend/graph/model"
)

var userContextKey = &contextKey{"user"}

type contextKey struct {
	name string
}

func WithContextUser(ctx context.Context, user *model.User) context.Context {
	return context.WithValue(ctx, userContextKey, user)
}

func GetContextUser(ctx context.Context) (*model.User, error) {
	user, found := ctx.Value(userContextKey).(*model.User)
	if !found {
		return nil, fmt.Errorf("could not authenticate, invalid token: user=%v found=%v", user, found)
	}

	return user, nil
}

func IsAuthenticated(ctx context.Context) bool {
	_, err := GetContextUser(ctx)
	return err == nil
}
