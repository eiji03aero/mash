package user

type UserCreated struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	HashedPassword string `json:"hashed_password"`
}

type UserLoggedIn struct {
	Token string `json:"token"`
}
