package authquery

import (
	"authquery/domain"
)

type Repository interface {
	CreateUser(*domain.User) (err error)
	LoadUsers() (users []*domain.User, err error)
	LoadUserByName(name string) (user *domain.User, err error)
}
