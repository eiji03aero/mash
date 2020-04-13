package domain

import (
	"errors"
)

var (
	ErrDataNotFound    = errors.New("data not found")
	ErrUserNameTaken   = errors.New("user name is already taken")
	ErrUserNameInvalid = errors.New("user name is invalid")
)
