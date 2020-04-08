import { apolloClient } from "./apolloClient";
import * as docs from "./docs";

export {
  apolloClient
}

// This is just testing purpose.
// Should be removed once real implementations begin
document.addEventListener("DOMContentLoaded", () => {
  apolloClient.query({
    query: docs.queries.Todos,
  })
    .then((res) => {
      console.log("query:", res);
    })

  apolloClient.subscribe({
    query: docs.subscriptions.TodoAdded,
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
      mutation: docs.mutations.CreateTodo,
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
