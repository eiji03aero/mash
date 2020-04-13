package auth

import (
	userent "auth/domain/entity/user"
)

type AuthQueryProxy interface {
	LoadUsers() ([]*userent.User, error)
	LoadUserByName(name string) (*userent.User, error)
}
