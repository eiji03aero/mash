// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type ILogin struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type INewTodo struct {
	Text   string `json:"text"`
	UserID string `json:"userId"`
}

type ISignup struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type RLogin struct {
	Token string `json:"token"`
}

type RSignup struct {
	User *User `json:"user"`
}

type Todo struct {
	ID   string `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
	User *User  `json:"user"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
