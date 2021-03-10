This repo contains a custom re-useable graphiql component with explorer attached and custom css styling

Following are some of the primary props that graphiql expects 

- `fetcher`

A fetcher function to introspect and query graphql api

- `schema`

A stringified graphql schema that is used to render docs and explorer menu

- `ideName`

A custom name / logo for graphql IDE 

- `query`

Default query 

- `menu`

A default menu to support multiple apis's with single IDE

For complete example please check `example` dir.