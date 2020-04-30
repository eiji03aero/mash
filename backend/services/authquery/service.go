package authquery

import (
	"authquery/domain"
)

type Service interface {
	CreateUser(*domain.User) error
	UpdateUser(*domain.User) error
	LoadUsers() (users []*domain.User, err error)
	LoadUser(params map[string]interface{}) (user *domain.User, err error)
}
