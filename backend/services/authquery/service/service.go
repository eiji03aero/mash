package service

import (
	"authquery"
)

type service struct {
	repository authquery.Repository
}

func New(
	repository authquery.Repository,
) authquery.Service {
	return &service{
		repository: repository,
	}
}
