package main

import (
	"frontend/service"
)

func main() {
	_ := service.New()

	bff := make(chan bool)
	<-bff
}