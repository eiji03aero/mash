package main

import (
	"fs/service"

	"github.com/eiji03aero/mskit/utils/logger"
)

func main() {
	_ = service.New()

	logger.Println(logger.CyanString("server started listening ..."))
}
