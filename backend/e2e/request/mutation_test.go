package request

import (
	"context"
	"log"
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
		log.Println("client: ", client)
		err := client.Run(ctx, req, &res)

		log.Println(err)
		assert.GreaterOrEqual(t, len(res.Users), 0)
		assert.NoError(t, err)
	})
}
