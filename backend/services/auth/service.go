package auth

import (
	userent "auth/domain/entity/user"
)

type Service interface {
	CreateUser(cmd userent.CreateUser) (*userent.UserAggregate, error)
}
