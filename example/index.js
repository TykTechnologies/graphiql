import React, { useState, useEffect } from 'react';
import { printSchema, buildClientSchema, getIntrospectionQuery } from 'graphql';
import TykGraphiQL from '@tyk-technologies/graphiql';
import './common/styles/index.scss';

const Example = () => {
  const [selectedApi, setSelectedApi] = useState({
    name: 'Countries',
    url: 'https://countries.trevorblades.com/',
  });

  const [query, setQuery] = useState(`{
    countries {
      name
    }
  }
  `);

  const defaultSchema =
    'directive @cacheControl(maxAge: Int, scope: CacheControlScope) on FIELD_DEFINITION | OBJECT | INTERFACE\n\nenum CacheControlScope {\n  PUBLIC\n  PRIVATE\n}\n\ntype Continent {\n  code: ID!\n  name: String!\n  countries: [Country!]!\n}\n\ninput ContinentFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Country {\n  code: ID!\n  name: String!\n  native: String!\n  phone: String!\n  continent: Continent!\n  capital: String\n  currency: String\n  languages: [Language!]!\n  emoji: String!\n  emojiU: String!\n  states: [State!]!\n}\n\ninput CountryFilterInput {\n  code: StringQueryOperatorInput\n  currency: StringQueryOperatorInput\n  continent: StringQueryOperatorInput\n}\n\ntype Language {\n  code: ID!\n  name: String\n  native: String\n  rtl: Boolean!\n}\n\ninput LanguageFilterInput {\n  code: StringQueryOperatorInput\n}\n\ntype Query {\n  continents(filter: ContinentFilterInput): [Continent!]!\n  continent(code: ID!): Continent\n  countries(filter: CountryFilterInput): [Country!]!\n  country(code: ID!): Country\n  languages(filter: LanguageFilterInput): [Language!]!\n  language(code: ID!): Language\n}\n\ntype State {\n  code: String\n  name: String!\n  country: Country!\n}\n\ninput StringQueryOperatorInput {\n  eq: String\n  ne: String\n  in: [String]\n  nin: [String]\n  regex: String\n  glob: String\n}\n\n"""The `Upload` scalar type represents a file upload."""\nscalar Upload\n';

  const [schema, setSchema] = useState(defaultSchema);

  const fetcher = async (graphQLParams) => {
    const data = await fetch(selectedApi.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
      credentials: 'same-origin',
    });
    return data.json().catch(() => data.text());
  };

  const menu = {
    label: 'Select Api',
    title: 'Select Api',
    onSelect: (item) => {
      console.log('ITEM_SELECTED', { item });
      setSelectedApi(item.value);
      setQuery('');
    },
    items: [
      {
        label: 'Countries',
        value: {
          url: 'https://countries.trevorblades.com/',
        },
      },
      {
        label: 'Space X',
        value: {
          url: 'https://api.spacex.land/graphql',
        },
      },
    ],
  };

  const getSchema = () => {
    return fetcher({
      query: getIntrospectionQuery(),
    }).then((result) => {
      if (result && result.error) {
        return;
      }
      const schema = printSchema(buildClientSchema(result.data));
      setSchema(schema);
    });
  };

  useEffect(() => {
    getSchema();
  }, [selectedApi]);

  return (
    <TykGraphiQL
      fetcher={fetcher}
      query={query}
      schema={schema}
      ideName={'TYK'}
      menu={menu}
    />
  );
};

export default Example;
