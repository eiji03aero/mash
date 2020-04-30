package frontend

import (
	"frontend/graph/model"
)

type AuthProxy interface {
	CreateUser(input model.ISignup) (*model.User, error)
	LoginUser(input model.ILogin) (string, error)
	LogoutUser(id string) error
}

type AuthQueryProxy interface {
	LoadUsers() ([]*model.User, error)
	LoadUser(map[string]interface{}) (*model.User, error)
}
