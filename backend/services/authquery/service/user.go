package service

import (
	"authquery/domain"
)

func (s *service) CreateUser(user *domain.User) (err error) {
	return s.repository.CreateUser(user)
}

func (s *service) LoadUsers() (users []*domain.User, err error) {
	return s.repository.LoadUsers()
}

func (s *service) LoadUserByName(name string) (user *domain.User, err error) {
	return s.repository.LoadUserByName(name)
}
