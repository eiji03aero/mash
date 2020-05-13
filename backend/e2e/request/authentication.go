package request

import (
	"github.com/machinebox/graphql"
)

type User struct {
	Id    string `json:"id"`
	Name  string `json:"name"`
	Token string `json:"token"`
}

type SignupParams struct {
	Name     string
	Password string
}

func Signup(params SignupParams) (*User, error) {
	req := graphql.NewRequest(`
mutation ($input: ISignup!) {
	signup(input: $input) {
		user {
			id
			name
		}
	}
}
	`)
	req.Var("input", map[string]interface{}{
		"name":     params.Name,
		"password": params.Password,
	})

	var res struct {
		Signup struct {
			User User `json:"user"`
		} `json:"signup"`
	}

	err := client.Run(requestContext(), req, &res)
	if err != nil {
		return nil, err
	}

	return &res.Signup.User, nil
}

type LoginParams struct {
	Name     string
	Password string
}

func Login(params LoginParams) (string, error) {
	req := graphql.NewRequest(`
mutation ($input: ILogin!) {
	login(input: $input) {
		token
	}
}
	`)
	req.Var("input", map[string]interface{}{
		"name":     params.Name,
		"password": params.Password,
	})

	var res struct {
		Login struct {
			Token string `json:"token"`
		} `json:"login"`
	}

	err := client.Run(requestContext(), req, &res)
	if err != nil {
		return "", err
	}

	return res.Login.Token, nil
}

type LogoutParams struct {
	Token string
}

func Logout(params LogoutParams) error {
	req := graphql.NewRequest(`
mutation {
	logout {
		none
	}
}
	`)
	req.Header.Add("Authentication", "Bearer "+params.Token)

	var res interface{}

	err := client.Run(requestContext(), req, &res)
	return err
}
