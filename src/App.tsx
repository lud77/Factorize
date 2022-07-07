import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

import panelPalettes from './components/panels';
import getSequence from './utils/sequence';

const getNextPanelId = getSequence();
const getNextEndpointId = getSequence();

const App = () => {
	return (
		<div className="App">
			<Editor
				panelPalettes={panelPalettes}
				getNextPanelId={getNextPanelId}
				getNextEndpointId={getNextEndpointId}
				>
			</Editor>
		</div>
	);
};

export default App;
