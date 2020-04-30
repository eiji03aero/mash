package auth

import (
	userent "auth/domain/entity/user"
)

type Service interface {
	CreateUser(cmd userent.CreateUser) (*userent.UserAggregate, error)
	LoginUser(cmd userent.LoginUser) (string, error)
	LogoutUser(cmd userent.LogoutUser) error
}
