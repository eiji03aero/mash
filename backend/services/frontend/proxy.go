package frontend

import (
	"frontend/graph/model"
)

type AuthProxy interface {
	CreateUser(input model.Signup) (*model.User, error)
}

type AuthQueryProxy interface {
	LoadUsers() ([]*model.User, error)
}

type HogeProxy interface {
}
