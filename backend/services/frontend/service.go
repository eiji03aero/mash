package frontend

import (
	"frontend/graph/model"
)

type Service interface {
	Signup(model.ISignup) (*model.RSignup, error)
	Login(model.ILogin) (*model.RLogin, error)
	Logout(token string) (*model.RNone, error)
	LoadUser(map[string]interface{}) (*model.User, error)
}
