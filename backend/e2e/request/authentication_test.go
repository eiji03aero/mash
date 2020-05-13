package request

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestAuthentication(t *testing.T) {
	var (
		name     = "test-user" + time.Now().String()
		password = "test123"
		token    string
	)

	// -------------------- signup --------------------
	user, err := Signup(SignupParams{
		Name:     name,
		Password: password,
	})

	assert.NoError(t, err)
	assert.Equal(t, user.Name, name)
	assert.Greater(t, len(user.Id), 0)
	assert.Greater(t, len(user.Name), 0)

	// -------------------- login --------------------
	token, err = Login(LoginParams{
		Name:     name,
		Password: password,
	})

	assert.NoError(t, err)
	assert.Greater(t, len(token), 0)

	// -------------------- logout --------------------
	err = Logout(LogoutParams{
		Token: token,
	})

	assert.NoError(t, err)
}
