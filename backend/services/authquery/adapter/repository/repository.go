package repository

import (
	"authquery"

	"go.mongodb.org/mongo-driver/mongo"
)

const (
	DatabaseName = "repository"
)

type repository struct {
	client *mongo.Client
}

func New(client *mongo.Client) authquery.Repository {
	return &repository{
		client: client,
	}
}

func (r *repository) db() *mongo.Database {
	return r.client.Database(DatabaseName)
}

func (r *repository) collection_Users() *mongo.Collection {
	return r.db().Collection("users")
}
