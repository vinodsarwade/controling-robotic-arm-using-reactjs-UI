import React from 'react';
import './App.css';
import Buttons from './component/Buttons'; // Make sure the path is correct

function App() {
  return (
    <div className="App row">
      <h1>Robotic Arm</h1>
      
      <Buttons /> {/* This is how you use the Buttons component */}

    

    </div>
  );
}

export default App;
