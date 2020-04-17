package users

import (
	"auth"
	"auth/domain"
	userent "auth/domain/entity/user"

	"github.com/eiji03aero/mskit"
	"github.com/eiji03aero/mskit/utils"
)

type Service struct {
	eventRepository *mskit.EventRepository
	authQueryProxy  auth.AuthQueryProxy
}

func New(
	er *mskit.EventRepository,
	aqpxy auth.AuthQueryProxy,
) *Service {
	return &Service{
		eventRepository: er,
		authQueryProxy:  aqpxy,
	}
}

func (s *Service) Create(cmd userent.CreateUser) (userAgg *userent.UserAggregate, err error) {
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

	err = s.eventRepository.ExecuteCommand(userAgg, cmd)
	if err != nil {
		return
	}

	return
}

func (s *Service) Login(cmd userent.LoginUser) (token string, err error) {
	userAgg, err := s.LoadUserAggregateByName(cmd.Name)
	if err != nil {
		return
	}

	err = s.eventRepository.ExecuteCommand(userAgg, cmd)
	if err != nil {
		return
	}

	token = userAgg.GetUserToken()

	return
}

func (s *Service) LoadUserAggregateByName(name string) (userAgg *userent.UserAggregate, err error) {
	userAgg = userent.NewUserAggregate()
	user, err := s.authQueryProxy.LoadUserByName(name)
	if err != nil {
		return
	}

	err = s.eventRepository.Load(user.Id, userAgg)
	if err != nil {
		return
	}

	return
}
