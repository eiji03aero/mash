package users

import (
	"auth"
	"auth/domain"
	userent "auth/domain/entity/user"

	"github.com/eiji03aero/mskit"
	"github.com/eiji03aero/mskit/utils"
)

type Service struct {
	authQueryProxy auth.AuthQueryProxy
}

func New(
	aqpxy auth.AuthQueryProxy,
) *Service {
	return &Service{
		authQueryProxy: aqpxy,
	}
}

func (s *Service) Create(cmd userent.CreateUser) (
	userAgg *userent.UserAggregate,
	events mskit.Events,
	err error,
) {
	if cmd.Name == "" {
		err = domain.ErrUserNameInvalid
		return
	}

	_, err = s.authQueryProxy.LoadUserByName(cmd.Name)
	if err == nil {
		err = domain.ErrUserNameTaken
		return
	} else if err != domain.ErrDataNotFound {
		return
	}

	id, err := utils.UUID()
	if err != nil {
		return
	}

	cmd.Id = id
	userAgg = userent.NewUserAggregate()

	events, err = userAgg.Process(cmd)

	return
}
