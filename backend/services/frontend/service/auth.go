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
		return
	}

	result.Token = token
	return
}

func (s *service) Logout(token string) (result *bool, err error) {
	user, err := s.authQueryProxy.LoadUser(map[string]interface{}{
		"token": token,
	})
	if err != nil {
		return
	}

	err = s.authProxy.LogoutUser(user.ID)
	if err != nil {
		return
	}

	return
}
