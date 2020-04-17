package service

import (
	userent "auth/domain/entity/user"
)

func (s *service) CreateUser(cmd userent.CreateUser) (userAgg *userent.UserAggregate, err error) {
	userAgg, err = s.userService.Create(cmd)
	if err != nil {
		return
	}

	return
}

func (s *service) LoginUser(cmd userent.LoginUser) (token string, err error) {
	token, err = s.userService.Login(cmd)
	if err != nil {
		return
	}

	return
}
