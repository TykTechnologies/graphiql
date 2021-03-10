import React from 'react';
import { render } from 'react-dom';
import TykGraphiQL from './graphiql';

import Example from './example';
render(<Example />, document.getElementById('root'));

export {TykGraphiQL};
export default TykGraphiQL;