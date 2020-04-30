package authquery

import (
	"authquery/domain"
)

type Repository interface {
	CreateUser(*domain.User) (err error)
	UpdateUser(*domain.User) (err error)
	LoadUsers() (users []*domain.User, err error)
	LoadUser(params map[string]interface{}) (user *domain.User, err error)
}
