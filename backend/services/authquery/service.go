package authquery

import (
	"authquery/domain"
)

type Service interface {
	CreateUser(*domain.User) error
	LoadUsers() (users []*domain.User, err error)
	LoadUserByName(name string) (user *domain.User, err error)
}
