package user

import (
	"github.com/eiji03aero/mskit"
	"github.com/eiji03aero/mskit/utils"
	"github.com/eiji03aero/mskit/utils/errbdr"
	"golang.org/x/crypto/bcrypt"
)

const (
	HashCost int = 10
)

type UserAggregate struct {
	mskit.BaseAggregate
	User *User `json:"user"`
}

func NewUserAggregate() *UserAggregate {
	return &UserAggregate{
		User: &User{},
	}
}

func (u *UserAggregate) GetUserToken() string {
	return u.User.Token
}

func (u *UserAggregate) Validate() (errs []error) {
	return
}

func (u *UserAggregate) Process(command interface{}) (mskit.Events, error) {
	switch cmd := command.(type) {
	case CreateUser:
		return u.processCreateUser(cmd)
	case LoginUser:
		return u.processLoginUser(cmd)
	default:
		return mskit.Events{}, errbdr.NewErrUnknownParams(u.Process, cmd)
	}
}

func (u *UserAggregate) processCreateUser(cmd CreateUser) (events mskit.Events, err error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(cmd.Password), HashCost)
	if err != nil {
		return
	}

	events = mskit.NewEventsSingle(
		cmd.Id,
		UserAggregate{},
		UserCreated{
			Id:             cmd.Id,
			Name:           cmd.Name,
			HashedPassword: string(hashedPassword),
		},
	)
	return
}

func (u *UserAggregate) processLoginUser(cmd LoginUser) (events mskit.Events, err error) {
	err = bcrypt.CompareHashAndPassword([]byte(u.User.HashedPassword), []byte(cmd.Password))
	if err != nil {
		return
	}

	token, err := utils.UUID()
	if err != nil {
		return
	}

	events = mskit.NewEventsSingle(
		u.Id,
		UserAggregate{},
		UserLoggedIn{
			Token: token,
		},
	)
	return
}

func (u *UserAggregate) Apply(event interface{}) error {
	switch e := event.(type) {
	case UserCreated:
		return u.applyUserCreated(e)
	case UserLoggedIn:
		return u.applyUserLoggedIn(e)
	default:
		return errbdr.NewErrUnknownParams(u.Apply, e)
	}
}

func (u *UserAggregate) applyUserCreated(e UserCreated) (err error) {
	u.User.Id = e.Id
	u.User.Name = e.Name
	u.User.HashedPassword = e.HashedPassword
	return
}

func (u *UserAggregate) applyUserLoggedIn(e UserLoggedIn) (err error) {
	u.User.Token = e.Token
	return
}
