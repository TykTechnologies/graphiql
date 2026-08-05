import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {
  buildClientSchema,
  getIntrospectionQuery,
  printSchema,
} from 'graphql';
import TykGraphiQL from './graphiql';

const GraphqlIDE = ({
  selectedApi,
  setSelectedApi,
  config,
  headers,
  setHeaders,
}) => {
  const [schema, setSchema] = useState(config.schema || null);

  const fetcher = async (graphQLParams) => {
    const response = await fetch(selectedApi.url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(graphQLParams),
      credentials: 'same-origin',
    });

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      return text;
    }
  };

  const menu = {
    label: 'Select Api',
    title: 'Select Api',
    onSelect: (item) => setSelectedApi(item.value),
    items: config.schemaUrls.map((api) => ({
      label: api.name,
      value: { url: api.url },
    })),
  };

  useEffect(() => {
    let active = true;

    setSchema(config.schema || null);

    fetcher({ query: getIntrospectionQuery() })
      .then((result) => {
        if (!active || !result || result.error || result.errors || !result.data) {
          return;
        }

        try {
          const nextSchema = printSchema(buildClientSchema(result.data));
          if (active) {
            setSchema(nextSchema);
          }
        } catch (error) {
          return;
        }
      })
      .catch(() => {
        return;
      });

    return () => {
      active = false;
    };
  }, [selectedApi, headers]);

  const handleHeaderEdit = (headerStr) => {
    try {
      const parsed = headerStr.trim() === '' ? {} : JSON.parse(headerStr);
      setHeaders((prev) =>
        JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed
      );
    } catch (error) {
      return;
    }
  };

  return (
    <TykGraphiQL
      fetcher={fetcher}
      schema={schema}
      ideName={config.ideName || 'Playground'}
      menu={menu.items.length > 1 && menu}
      onEditHeaders={handleHeaderEdit}
      headerEditorEnabled
      shouldPersistHeaders={false}
    />
  );
};

const TykGraphqlIDE = ({ config }) => {
  const [headers, setHeaders] = useState({});
  const [selectedApi, setSelectedApi] = useState({
    name: config?.schemaUrls[0]?.name,
    url: config?.schemaUrls[0]?.url,
  });

  return (
    <GraphqlIDE
      selectedApi={selectedApi}
      setSelectedApi={setSelectedApi}
      headers={headers}
      setHeaders={setHeaders}
      config={config}
    />
  );
};

class GraphiqlInit {
  constructor(config) {
    render(
      <TykGraphqlIDE config={config} />,
      document.getElementById(config.containerId)
    );
  }
}

export default GraphiqlInit;

window.GraphiqlInit = GraphiqlInit;
