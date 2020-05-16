package service

import (
	"fsquery"
)

type service struct {
}

func New() fsquery.Service {
	return &service{}
}