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
		return
	}

	return
}

func (r *repository) UpdateUser(user *domain.User) (err error) {
	coll := r.collection_Users()

	_, err = coll.UpdateOne(
		context.Background(),
		bson.M{"id": user.Id},
		bson.M{"$set": user},
	)
	if err != nil {
		return
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

func (r *repository) LoadUser(params map[string]interface{}) (user *domain.User, err error) {
	user = &domain.User{}
	ctx := context.Background()
	coll := r.collection_Users()

	filter := bson.M{}

	if v, ok := params["id"]; ok {
		filter["id"] = v
	}
	if v, ok := params["token"]; ok {
		filter["token"] = v
	}
	if v, ok := params["name"]; ok {
		filter["name"] = v
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
