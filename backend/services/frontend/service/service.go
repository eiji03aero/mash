package service

import (
	"frontend"
)

type service struct {
}

func New() frontend.Service {
	return &service{}
}