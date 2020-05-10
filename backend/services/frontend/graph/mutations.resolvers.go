package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
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

func (r *mutationResolver) Logout(ctx context.Context) (*model.RNone, error) {
	user, err := GetContextUser(ctx)
	if err != nil {
		return nil, err
	}

	return r.service.Logout(user.Token)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
