package auth

import (
	userent "auth/domain/entity/user"
)

type AuthQueryProxy interface {
	LoadUsers() ([]*userent.User, error)
	LoadUser(map[string]interface{}) (*userent.User, error)
}
