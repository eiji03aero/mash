package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	// "log"
	"os"
	"strings"

	_ "github.com/lib/pq"
)

type TestUser struct {
	UserID   int
	Password string
}

func main() {
	Db := prepareDb()

	users := []struct {
		id            int
		user_password string
	}{
		{0, "domo"},
		{1, "domo"},
		{2, "domo"},
	}
}

func prepareDb() *sql.DB {
	var Db *sql.DB
	var dbOptions = fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	Db, err := sql.Open("postgres", dbOptions)
	if err != nil {
		panic(err)
	}

	createTableFile, err := ioutil.ReadFile("./sql/init/1_create-table.sql")
	if err != nil {
		panic(nil)
	}

	requests := strings.Split(string(createTableFile), ";")
	for _, request := range requests {
		_, err := Db.Exec(request)
		if err != nil {
			panic(err)
		}
	}

	return Db
}
