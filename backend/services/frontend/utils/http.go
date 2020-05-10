package utils

import (
	"net/http"
)

type HTTPContext struct {
	W *http.ResponseWriter
	R *http.Request
}
