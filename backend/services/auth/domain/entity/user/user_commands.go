package user

type CreateUser struct {
	Id       string `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type LoginUser struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type LogoutUser struct {
	Id string `json:"id"`
}
