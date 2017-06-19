import React, { Component } from 'react';
import { render } from 'react-dom';
import Demo1 from './demo1'

class App extends Component{
  render(){
    return (
      <div>
        <div className="demo">
          <Demo1/>
        </div>
      </div>
    )
  }
}

render(<App/>,document.getElementById('root'));