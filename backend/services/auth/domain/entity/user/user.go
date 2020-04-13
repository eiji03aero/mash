package user

type User struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	HashedPassword string `json:"hashed_password"`
}
