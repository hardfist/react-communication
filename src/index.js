import React, { Component } from 'react';
import { render } from 'react-dom';
import Demo1 from './demo1'
import Demo2 from './demo2'
import Demo3 from './demo3'
import Demo4 from './demo4'
import Demo5 from './demo5'
import Demo6 from './demo6'
import Demo7 from './demo7'
import Demo8 from './demo8'
import Demo9 from './demo9'
import './index.css';

class App extends Component{
  render(){
    return (
      <div>
        <div className="demo">
          <Demo1/>
        </div>
        <div className="demo">
          <Demo2/>
        </div>
        <div className="demo">
          <Demo3/>
        </div>
        <div className="demo">
          <Demo4/>
        </div>
        <div className="demo">
          <Demo5/>
        </div>
        <div className="demo">
          <Demo6/>
        </div>
        <div className="demo">
          <Demo7/>
        </div>
        <div className="demo">
          <Demo8/>
        </div>
        <div className="demo">
          <Demo9/>
        </div>
      </div>
    )
  }
}

render(<App/>,document.getElementById('root'));