import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

import panelsFactory from './components/panels';
import getSequence from './utils/sequence';

const panels = panelsFactory();

const getNextPanelId = getSequence();
const getNextEndpointId = getSequence();

const App = () => {
	return (
		<div className="App">
			<Editor panels={panels} getNextPanelId={getNextPanelId} getNextEndpointId={getNextEndpointId}></Editor>
		</div>
	);
};

export default App;
