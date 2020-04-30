package user

type UserCreated struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	HashedPassword string `json:"hashed_password"`
}

type UserLoggedIn struct {
	Id    string `json:"id"`
	Token string `json:"token"`
}

type UserLoggedOut struct {
	Id string `json:"id"`
}
