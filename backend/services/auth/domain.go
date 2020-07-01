package auth

import (
	userent "auth/domain/entity/user"
)

type UserService interface {
	Create(userent.CreateUser) (*userent.UserAggregate, error)
	LoginUser(userent.LoginUser) (string, error)
	LogoutUser(cmd userent.LogoutUser) error
}
