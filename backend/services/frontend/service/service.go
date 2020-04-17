package service

import (
	"frontend"
)

type service struct {
	authProxy      frontend.AuthProxy
	authQueryProxy frontend.AuthQueryProxy
}

func New(
	apxy frontend.AuthProxy,
	aqpxy frontend.AuthQueryProxy,
) frontend.Service {
	return &service{
		authProxy:      apxy,
		authQueryProxy: aqpxy,
	}
}
