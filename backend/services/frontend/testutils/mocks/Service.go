// Code generated by mockery v1.0.0. DO NOT EDIT.

package mocks

import (
	model "frontend/graph/model"

	mock "github.com/stretchr/testify/mock"
)

// Service is an autogenerated mock type for the Service type
type Service struct {
	mock.Mock
}

// LoadUser provides a mock function with given fields: _a0
func (_m *Service) LoadUser(_a0 map[string]interface{}) (*model.User, error) {
	ret := _m.Called(_a0)

	var r0 *model.User
	if rf, ok := ret.Get(0).(func(map[string]interface{}) *model.User); ok {
		r0 = rf(_a0)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.User)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(map[string]interface{}) error); ok {
		r1 = rf(_a0)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Login provides a mock function with given fields: _a0
func (_m *Service) Login(_a0 model.ILogin) (*model.RLogin, error) {
	ret := _m.Called(_a0)

	var r0 *model.RLogin
	if rf, ok := ret.Get(0).(func(model.ILogin) *model.RLogin); ok {
		r0 = rf(_a0)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.RLogin)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(model.ILogin) error); ok {
		r1 = rf(_a0)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Logout provides a mock function with given fields: token
func (_m *Service) Logout(token string) (*model.RNone, error) {
	ret := _m.Called(token)

	var r0 *model.RNone
	if rf, ok := ret.Get(0).(func(string) *model.RNone); ok {
		r0 = rf(token)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.RNone)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(string) error); ok {
		r1 = rf(token)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// Signup provides a mock function with given fields: _a0
func (_m *Service) Signup(_a0 model.ISignup) (*model.RSignup, error) {
	ret := _m.Called(_a0)

	var r0 *model.RSignup
	if rf, ok := ret.Get(0).(func(model.ISignup) *model.RSignup); ok {
		r0 = rf(_a0)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.RSignup)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(model.ISignup) error); ok {
		r1 = rf(_a0)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}