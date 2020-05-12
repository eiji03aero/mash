package domain

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHTTPContext(t *testing.T) {
	resWriter := http.ResponseWriter(httptest.NewRecorder())
	request := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader([]byte{}))
	httpContext := HTTPContext{
		W: &resWriter,
		R: request,
	}

	assert.NotNil(t, httpContext.W)
	assert.NotNil(t, httpContext.R)
}
