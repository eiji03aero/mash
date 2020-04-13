package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"encoding/json"
	"frontend/graph/generated"
	"frontend/graph/model"
)

func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
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

func (r *mutationResolver) Signup(ctx context.Context, input model.Signup) (*model.User, error) {
	user, err := r.authProxy.CreateUser(input)
	if err != nil {
		return user, err
	}

	return user, err
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
