package service

import (
	"authquery/domain"
)

func (s *service) CreateUser(user *domain.User) (err error) {
	return s.repository.CreateUser(user)
}

func (s *service) UpdateUser(user *domain.User) (err error) {
	return s.repository.UpdateUser(user)
}

func (s *service) LoadUsers() (users []*domain.User, err error) {
	return s.repository.LoadUsers()
}

func (s *service) LoadUser(params map[string]interface{}) (user *domain.User, err error) {
	return s.repository.LoadUser(params)
}
