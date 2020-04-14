import { apolloClient } from "./apolloClient";
import * as tag from "./tag";

export {
  apolloClient,
  tag
}

// This is just testing purpose.
// Should be removed once real implementations begin
document.addEventListener("DOMContentLoaded", () => {
  apolloClient.subscribe({
    query: tag.subscriptions.TodoAdded,
    variables: {
      userId: "hoge",
    }
  })
    .subscribe({
      next (data: any) {
        console.log("subsc:", data);
      }
    });

  setTimeout(() => {
    apolloClient.mutate({
      mutation: tag.mutations.CreateTodo,
      variables: {
        input: {
          text: "eena todo",
          userId: "hoge"
        }
      }
    })
      .then((res: any) => {
        console.log("mutated:", res)
      })
  }, 1000);
})
