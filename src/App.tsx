import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

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
