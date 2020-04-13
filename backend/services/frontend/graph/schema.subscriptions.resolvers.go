package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"frontend/graph/generated"
	"frontend/graph/model"
)

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

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type subscriptionResolver struct{ *Resolver }
