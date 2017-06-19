import React, { Component } from 'react';
import { render } from 'react-dom';
import Demo1 from './demo1'
import Demo2 from './demo2'

class App extends Component{
  render(){
    return (
      <div>
        <div className="demo">
          <Demo1/>
          <Demo2/>
        </div>
      </div>
    )
  }
}

render(<App/>,document.getElementById('root'));