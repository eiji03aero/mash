package service

import (
	"fs"
)

type service struct {
}

func New() fs.Service {
	return &service{}
}