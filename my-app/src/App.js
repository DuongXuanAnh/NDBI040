
import './App.css';
import { FireStore } from './component/firestore';
import { Realtime } from './component/realtime';

function App() {

  
  return (
    <div className="App">
      <Realtime />
      <FireStore />
    </div>
  );
}

export default App;
