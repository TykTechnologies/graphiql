import React, { useRef, useEffect, useState } from 'react';
import GraphiQL from 'graphiql';
import PropTypes from 'prop-types';
import { buildSchema } from 'graphql';
import GraphiQLExplorer from 'graphiql-explorer';
import 'graphiql/graphiql.min.css';
import './common/styles/index.scss';

const TykGraphiQL = (props) => {
  const {
    fetcher,
    schema,
    ideName = 'TykGraphiQL',
    query: initialQuery = '{}',
    showPlayground = true,
    menu,
  } = props;
  const playgroundWrapperRef = useRef(null);
  let playgroundRef = useRef(null);
  const [explorerIsOpen, setExplorerIsOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [selectedMenu, setSelectedMenu] = useState(menu?.title);

  useEffect(() => {
    if (!playgroundWrapperRef.current) {
      return;
    }

    playgroundWrapperRef.current.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }, [playgroundWrapperRef]);

  const toggleExplorer = () => setExplorerIsOpen(!explorerIsOpen);

  const handleMenuSelection = (item) => {
    menu.onSelect(item);
    setSelectedMenu(item?.label);
  };

  return (
    <div
      ref={playgroundWrapperRef}
      className="graphiql-container"
      style={{
        visibility: showPlayground ? 'visible' : 'hidden',
      }}
    >
      <GraphiQLExplorer
        explorerIsOpen={explorerIsOpen}
        onToggleExplorer={toggleExplorer}
        onEdit={setQuery}
        schema={schema && buildSchema(schema)}
        query={query}
        onRunOperation={(operationName) =>
          playgroundRef.handleRunQuery(operationName)
        }
      />
      <GraphiQL
        ref={(ref) => {
          playgroundRef = ref;
          return true;
        }}
        {...props}
        schema={schema && buildSchema(schema)}
        fetcher={fetcher}
        query={query}
      >
        <GraphiQL.Logo key={'logo'}>{ideName}</GraphiQL.Logo>
        <GraphiQL.Toolbar>
          <GraphiQL.Button
            key={'explorer'}
            onClick={toggleExplorer}
            label="Explorer"
            title="Toggle Explorer"
          />
          <GraphiQL.Button
            key={'Prettify'}
            onClick={() => playgroundRef.handlePrettifyQuery()}
            label="Prettify"
            title="Prettify Query"
          />
          {menu?.items?.length && (
            <GraphiQL.Menu
              label={selectedMenu}
              title={selectedMenu}
              key={selectedMenu}
            >
              {menu.items.map((item) => (
                <GraphiQL.MenuItem
                  key={item.title}
                  onSelect={() => handleMenuSelection(item)}
                  title={item.title}
                  label={item.label}
                />
              ))}
            </GraphiQL.Menu>
          )}
        </GraphiQL.Toolbar>
      </GraphiQL>
    </div>
  );
};

TykGraphiQL.propTypes = {
  fetcher: PropTypes.func,
  schema: PropTypes.string,
  menu: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    onSelect: PropTypes.func,
    items: PropTypes.array,
  }),
  ideName: PropTypes.string,
  query: PropTypes.string,
  showPlayground: PropTypes.bool,
};

export default TykGraphiQL;
