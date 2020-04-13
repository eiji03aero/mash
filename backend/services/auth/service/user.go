package service

import (
	userent "auth/domain/entity/user"
)

func (s *service) CreateUser(cmd userent.CreateUser) (userAgg *userent.UserAggregate, err error) {
	userAgg, events, err := s.userService.Create(cmd)
	if err != nil {
		return
	}

	err = s.eventRepository.Save(userAgg, events)
	if err != nil {
		return
	}

	return
}
