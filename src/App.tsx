import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

import panelsFactory from './components/panels';
import getSequence from './utils/sequence';

const getNextEndpointId = getSequence();
const panels = panelsFactory(getNextEndpointId);

const App = () => {
	return (
		<div className="App">
			<Editor panels={panels}></Editor>
		</div>
	);
};

export default App;
