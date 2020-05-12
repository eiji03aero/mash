package graph

import (
	"testing"

	"frontend/graph/model"
	"frontend/testutils"
	"frontend/testutils/mocks"

	"github.com/99designs/gqlgen/client"
	"github.com/go-redis/redis"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func NewMockSet(t *testing.T) (ms struct {
	c     *client.Client
	rc    *redis.Client
	svc   *mocks.Service
	apxy  *mocks.AuthProxy
	aqpxy *mocks.AuthQueryProxy
}) {
	t.Helper()

	ms.rc = testutils.NewMockRedis(t)
	ms.svc = &mocks.Service{}
	ms.apxy = &mocks.AuthProxy{}
	ms.aqpxy = &mocks.AuthQueryProxy{}

	ms.c = client.New(NewServer(
		ms.rc,
		ms.svc,
		ms.apxy,
		ms.aqpxy,
	))

	return ms
}

func TestMutation(t *testing.T) {
	t.Run("Signup", func(t *testing.T) {
		ms := NewMockSet(t)

		ms.svc.
			On("Signup", mock.Anything).
			Return(&model.RSignup{User: &model.User{}}, nil)

		var resp interface{}
		query := `
mutation {
	signup(input: {
		name: "hoge",
		password: "kore"
	}) {
		user {
			id
		}
	}
}
`
		err := ms.c.Post(query, &resp)
		assert.NoError(t, err)

		ms.svc.AssertCalled(t, "Signup", model.ISignup{
			Name:     "hoge",
			Password: "kore",
		})
	})
}
