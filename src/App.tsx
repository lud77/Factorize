import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

import panelPalettes from './components/panels';

const App = () => {
	const [ filePath, setFilePath ] = React.useState<string>('');

	const documentMeta = {
		filePath,
		setFilePath
	};

	return (
		<div className="App">
			<Editor
				{...documentMeta}
				panelPalettes={panelPalettes}
				/>
		</div>
	);
};

export default App;
