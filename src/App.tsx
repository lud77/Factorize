import * as React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Editor></Editor>
      </header>
    </div>
  );
};

export default App;
