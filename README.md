# @tyk-technologies/graphiql — Gateway playground branch (`innersource/fix/TT-15516`)

**This branch exists solely to build the Tyk Gateway's bundled GraphQL playground asset**
(`lib/playground.js`) on GraphiQL 1.11.5. It is never merged to `main` and nothing is published
from it. The Gateway consumes the artifact by copying `lib/playground.js` into
`templates/playground/playground.js` and citing this branch, the tag
`tyk-playground-1.11.5-tt15516`, and the commit SHA in its commit message.

## Status of this package

- `main` and the published npm package (≤ `1.2.0`) are **legacy and must remain untouched**:
  Classic Portal release branches prior to December 2025 still resolve
  `@tyk-technologies/graphiql@1.2.0` from npm when built (Portal moved to vanilla GraphiQL in
  TT-16305). The `version` field on this branch intentionally stays `1.2.0` — npm refuses to
  republish an existing version, which makes accidental publication impossible.
- Current products do not consume this package: Classic Portal uses vanilla `graphiql@1.10.0`,
  Analytics UI uses vanilla GraphiQL 5.x.
- **Do not run `npm run build` (the library build).** It emits code-split chunks
  (`lib/*.index.js`) and a `lib/index.js` that must not be committed. `lib/index.js` on this
  branch is intentionally byte-identical to `main`. Only `npm run build:playground` is supported.

## Building the playground bundle

The build is pinned to Node 16 (see `engines`). Canonical, reproducible build:

```sh
docker run --rm -v "$PWD":/app -w /app node:16-alpine \
  sh -c "npm ci && npm run build:playground"
```

On a local Node ≥ 17 toolchain the equivalent is:

```sh
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build:playground
```

Both must produce a byte-identical `lib/playground.js`; verify with
`git diff -- lib/playground.js` after rebuilding. The output is a single self-contained file
(React bundled, no CDN/network dependencies) exposing `window.GraphiqlInit`.

## `GraphiqlInit` config contract

```js
new window.GraphiqlInit({
  containerId: 'root',          // required: DOM id to render into
  schemaUrls: [{ name, url }],  // required: one or more GraphQL endpoints
  ideName: 'My API',            // optional: logo text, defaults to "Playground"
  schema: '...SDL...',          // optional: initial schema as an SDL string
  query: '...',                 // optional: initial query, defaults to `query { __typename }`
});
```

Unknown keys are ignored (the Gateway's stock template still passes a legacy
`onSubscriptionError` key; it has no effect). Header editor behaviour: the JSON entered in the
headers tab is applied to **both** schema introspection and query execution; changing headers or
the selected API re-runs introspection; a failed or unauthorised introspection clears the schema;
clearing the editor removes all custom headers.

Gateway operators who want a custom `ideName` set it via a `template_path` override of
`templates/playground/index.html`, adding `ideName` to the `GraphiqlInit` config above.

## Dependency pins

Runtime dependencies are exact-pinned and mutually peer-compatible:
`graphiql 1.11.5` (final 1.x), `graphiql-explorer 0.9.0`, `graphql 15.10.2` (final 15.x),
`react`/`react-dom 16.14.0` (React 16 is required by `graphiql-explorer`'s peer range).
Known accepted advisories (CPU-complexity DoS in `markdown-it`/`linkify-it`, reachable only via
schema description text) are documented in the TT-15516 spec; they are unfixable on the GraphiQL
1.x line and are resolved by the GraphiQL 5.x workstream.
