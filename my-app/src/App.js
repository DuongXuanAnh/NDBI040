
import './App.css';
import { Realtime } from './component/realtime';
import { getDatabase, onValue, ref, set, push } from 'firebase/database';

function App() {

  
  return (
    <div className="App">
      <Realtime />
    </div>
  );
}

export default App;
