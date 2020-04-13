package repository

import (
	"context"

	"authquery/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func (r *repository) CreateUser(user *domain.User) (err error) {
	coll := r.collection_Users()

	_, err = coll.InsertOne(context.Background(), user)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) LoadUsers() (users []*domain.User, err error) {
	users = []*domain.User{}
	ctx := context.Background()
	coll := r.collection_Users()

	cur, err := coll.Find(ctx, bson.D{})
	if err != nil {
		return
	}
	defer cur.Close(ctx)

	for cur.Next(ctx) {
		user := &domain.User{}
		err = cur.Decode(user)
		if err != nil {
			return
		}

		users = append(users, user)
	}

	err = cur.Err()
	if err != nil {
		return
	}

	return
}

func (r *repository) LoadUserByName(name string) (user *domain.User, err error) {
	user = &domain.User{}
	ctx := context.Background()
	coll := r.collection_Users()

	filter := bson.D{
		{Key: "name", Value: name},
	}

	err = coll.FindOne(ctx, filter).Decode(user)
	if err == mongo.ErrNoDocuments {
		err = domain.ErrDataNotFound
		return
	} else if err != nil {
		return
	}

	return
}
