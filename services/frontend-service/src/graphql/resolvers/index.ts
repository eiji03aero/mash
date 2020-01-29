import { pubsub } from "../pubsub";

export const resolvers = {
  Subscription: {
    hello: {
      subscribe () {
        return pubsub.asyncIterator("publish_hello");
      }
    }
  }
};
