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

func (u *UserAggregate) Process(command interface{}) (events mskit.Events, err error) {
	switch cmd := command.(type) {
	case CreateUser:
		var hashedPassword []byte
		hashedPassword, err = bcrypt.GenerateFromPassword([]byte(cmd.Password), HashCost)
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

	case LoginUser:
		err = bcrypt.CompareHashAndPassword([]byte(u.User.HashedPassword), []byte(cmd.Password))
		if err != nil {
			return
		}

		var token string
		token, err = utils.UUID()
		if err != nil {
			return
		}

		events = mskit.NewEventsSingle(
			u.Id,
			UserAggregate{},
			UserLoggedIn{
				Id:    u.Id,
				Token: token,
			},
		)

	case LogoutUser:
		events = mskit.NewEventsSingle(
			u.Id,
			UserAggregate{},
			UserLoggedOut{
				Id: u.Id,
			},
		)

	default:
		return nil, errbdr.NewErrUnknownParams(u.Process, cmd)
	}

	return
}

func (u *UserAggregate) Apply(event interface{}) (err error) {
	switch e := event.(type) {
	case UserCreated:
		u.Id = e.Id
		u.User.Id = e.Id
		u.User.Name = e.Name
		u.User.HashedPassword = e.HashedPassword

	case UserLoggedIn:
		u.User.Token = e.Token

	case UserLoggedOut:
		u.User.Token = ""

	default:
		return errbdr.NewErrUnknownParams(u.Apply, e)
	}

	return
}
