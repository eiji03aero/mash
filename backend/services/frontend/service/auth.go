package service

import (
	"frontend/graph/model"
)

func (s *service) Signup(input model.ISignup) (result *model.RSignup, err error) {
	result = &model.RSignup{}

	user, err := s.authProxy.CreateUser(input)
	if err != nil {
		return
	}

	result.User = user
	return
}

func (s *service) Login(input model.ILogin) (result *model.RLogin, err error) {
	result = &model.RLogin{}

	token, err := s.authProxy.LoginUser(input)
	if err != nil {
		return nil, err
	}

	result.Token = token

	return
}
