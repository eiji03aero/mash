package graph

import (
	"encoding/json"
	"sync"

	"frontend"
	"frontend/graph/model"

	"github.com/go-redis/redis"
)

type Resolver struct {
	redisClient    *redis.Client
	authProxy      frontend.AuthProxy
	authQueryProxy frontend.AuthQueryProxy
	todoChannels   map[string]chan *model.Todo
	mutex          sync.Mutex
}

func NewResolver(
	rc *redis.Client,
	apxy frontend.AuthProxy,
	aqpxy frontend.AuthQueryProxy,
) *Resolver {
	return &Resolver{
		redisClient:    rc,
		authProxy:      apxy,
		authQueryProxy: aqpxy,
		todoChannels:   map[string]chan *model.Todo{},
		mutex:          sync.Mutex{},
	}
}

func (r *Resolver) StartSubscribingRedis() {
	pubsub := r.redisClient.Subscribe("todos")
	defer pubsub.Close()

	for {
		msgi, err := pubsub.Receive()
		if err != nil {
			continue
		}

		switch msg := msgi.(type) {
		case *redis.Message:
			todo := &model.Todo{}
			err = json.Unmarshal([]byte(msg.Payload), todo)
			if err != nil {
				continue
			}

			r.mutex.Lock()
			for _, ch := range r.todoChannels {
				ch <- todo
			}
			r.mutex.Unlock()
		}
	}
}
