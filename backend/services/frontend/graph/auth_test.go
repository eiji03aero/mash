package graph

import (
	"context"
	"testing"

	"frontend/graph/model"

	"github.com/stretchr/testify/assert"
)

func TestAuth(t *testing.T) {
	ctx := context.Background()
	user := &model.User{}

	ctx = WithContextUser(ctx, user)

	receivedUser, err := GetContextUser(ctx)
	assert.NoError(t, err)
	assert.Equal(t, user, receivedUser)
	assert.True(t, IsAuthenticated(ctx))
}
