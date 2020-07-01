package auth

import (
	userent "auth/domain/entity/user"
)

type UserService interface {
	Create(userent.CreateUser) (*userent.UserAggregate, error)
	Login(userent.LoginUser) (string, error)
	Logout(cmd userent.LogoutUser) error
}
