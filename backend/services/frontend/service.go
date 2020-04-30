package frontend

import (
	"frontend/graph/model"
)

type Service interface {
	Signup(model.ISignup) (*model.RSignup, error)
	Login(model.ILogin) (*model.RLogin, error)
	Logout(token string) (*bool, error)
}
