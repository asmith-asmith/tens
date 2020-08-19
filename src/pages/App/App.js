import React, { Component } from 'react';
import './App.css';
import ListCard from '../../components/ListCard/ListCard';
import ListList from '../../components/ListList/ListList';

class App extends Component {
  /*--- State ---*/

  /*--- Handle Methods ---*/

  /*--- Lifecycle Methods ---*/

  render() {
    return (
      <div className="App">
        <header className="App-header">MY APP</header>
        <ListCard/>
        <ListList/>
      </div>
    );
  }
}

export default App;
