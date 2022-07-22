import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

import panelPalettes from './components/panels';

const App = () => {
	return (
		<div className="App">
			<Editor
				panelPalettes={panelPalettes}
				>
			</Editor>
		</div>
	);
};

export default App;
