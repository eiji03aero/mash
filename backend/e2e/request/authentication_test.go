package request

import (
	"testing"
	"time"

	"github.com/machinebox/graphql"
	"github.com/stretchr/testify/assert"
)

func TestAuthentication(t *testing.T) {
	name := "test-user" + time.Now().String()
	password := "test123"

	signupReq := graphql.NewRequest(`
		mutation ($input: ISignup!) {
			signup(input: $input) {
				user {
					id
					name
				}
			}
		}
	`)
	signupReq.Var("input", map[string]interface{}{
		"name":     name,
		"password": password,
	})

	var res struct {
		Signup struct {
			User struct {
				Id   string `json:"id"`
				Name string `json:"name"`
			} `json:"user"`
		} `json:"signup"`
	}

	err := client.Run(requestContext(), signupReq, &res)

	assert.NoError(t, err)
	assert.Equal(t, name, res.Signup.User.Name)
}
