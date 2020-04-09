import { apolloClient } from "./apolloClient";
import * as tags from "./tags";

export {
  apolloClient,
  tags
}

// This is just testing purpose.
// Should be removed once real implementations begin
document.addEventListener("DOMContentLoaded", () => {
  apolloClient.query({
    query: tags.queries.Todos,
  })
    .then((res) => {
      console.log("query:", res);
    })

  apolloClient.subscribe({
    query: tags.subscriptions.TodoAdded,
    variables: {
      userId: "hoge",
    }
  })
    .subscribe({
      next (data) {
        console.log("subsc:", data);
      }
    });

  setTimeout(() => {
    apolloClient.mutate({
      mutation: tags.mutations.CreateTodo,
      variables: {
        input: {
          text: "eena todo",
          userId: "hoge"
        }
      }
    })
      .then((res) => {
        console.log("mutated:", res)
      })
  }, 1000);
})
