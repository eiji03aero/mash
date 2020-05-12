package request

import (
	"context"
	"testing"

	"github.com/machinebox/graphql"
	"github.com/stretchr/testify/assert"
)

func TestMutation(t *testing.T) {
	t.Run("Signup", func(t *testing.T) {
		req := graphql.NewRequest(`
			query {
				users {
					id
				}
			}
		`)

		ctx := context.Background()

		var res struct {
			Users []struct {
				Id string `json:"id"`
			} `json:"users"`
		}
		err := client.Run(ctx, req, &res)

		assert.GreaterOrEqual(t, len(res.Users), 0)
		assert.NoError(t, err)
	})
}
