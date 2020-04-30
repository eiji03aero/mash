package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"fmt"

	"frontend/graph/generated"
	"frontend/graph/model"
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input model.INewTodo) (*model.Todo, error) {
	todo := &model.Todo{
		ID:   "domo",
		Done: true,
		User: &model.User{
			ID:   "user1",
			Name: "Osakabe",
		},
	}

	tb, err := json.Marshal(todo)
	if err != nil {
		return nil, err
	}

	r.redisClient.Publish("todos", tb)
	return todo, nil
}

func (r *mutationResolver) Signup(ctx context.Context, input model.ISignup) (*model.RSignup, error) {
	return r.service.Signup(input)
}

func (r *mutationResolver) Login(ctx context.Context, input model.ILogin) (*model.RLogin, error) {
	return r.service.Login(input)
}

func (r *mutationResolver) Logout(ctx context.Context, _ *bool) (*bool, error) {
	token, ok := ctx.Value("token").(string)
	if !ok {
		return nil, fmt.Errorf("invalid token %s", token)
	}

	return r.service.Logout(token)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
