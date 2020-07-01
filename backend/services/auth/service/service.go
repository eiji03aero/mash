package service

import (
	"auth"
	usersvc "auth/domain/service/user"

	"github.com/eiji03aero/mskit"
)

type service struct {
	eventRepository *mskit.EventRepository
	authQueryProxy  auth.AuthQueryProxy
	userService     auth.UserService
}

func New(
	er *mskit.EventRepository,
	aqpxy auth.AuthQueryProxy,
) auth.Service {
	return &service{
		eventRepository: er,
		authQueryProxy:  aqpxy,
		userService:     usersvc.New(er, aqpxy),
	}
}
