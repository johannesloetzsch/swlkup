const endpoint = "http://localhost:4000/graphql";

/** add `Content-Type` header **/

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),

      headers: {
        'Content-Type': 'application/json',
      }

    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
