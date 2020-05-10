package testutils

import (
	"testing"

	"github.com/alicebob/miniredis"
	"github.com/go-redis/redis"
)

func NewMockRedis(t *testing.T) *redis.Client {
	t.Helper()

	s, err := miniredis.Run()
	if err != nil {
		t.Fatalf("could not run mock redis. %v", err)
	}

	client := redis.NewClient(&redis.Options{
		Addr:     s.Addr(),
		Password: "",
		DB:       0,
	})
	return client
}
