import logo from './logo.svg';
import './App.css';
import Board from './Board';

function App() {
  return (
    <div className="App" style={{width : '100%', height: '100vh'}}>
      <Board  boardLength={8}/>       
    </div>
  );
}

export default App;
