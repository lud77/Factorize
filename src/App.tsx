import * as React from 'react';
import Editor from './components/Editor/Editor';

import './App.css';
import './Colors.css';

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
				/>
		</div>
	);
};

export default App;
