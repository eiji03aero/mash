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

func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	user := &model.User{
		ID:   "user1",
		Name: "Osakabe",
	}
	todos := []*model.Todo{
		&model.Todo{
			ID:   "1",
			Done: false,
			Text: "clean the house",
			User: user,
		},
		&model.Todo{
			ID:   "2",
			Done: false,
			Text: "watch tv",
			User: user,
		},
		&model.Todo{
			ID:   "3",
			Done: true,
			Text: "go to police",
			User: user,
		},
	}

	return todos, nil
}

func (r *subscriptionResolver) TodoAdded(ctx context.Context, userID string) (<-chan *model.Todo, error) {
	todoChan := make(chan *model.Todo, 1)
	r.mutex.Lock()
	r.todoChannels[userID] = todoChan
	r.mutex.Unlock()

	go func() {
		<-ctx.Done()
		r.mutex.Lock()
		delete(r.todoChannels, userID)
		r.mutex.Unlock()
		r.redisClient.Del(userID)
	}()

	return todoChan, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
