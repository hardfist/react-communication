import React, { Component } from 'react';
/** 兄弟组件通信  */
export default class Convert extends Component {
  constructor(){
    super();
    this.state = {
      time: 0,
      isSec: false
    }
  }
  calculateSec(){
    const { time, isSec } = this.state;
    if(isSec){
      return time;
    }else{
      return time*60;
    }
  }
  calculateMin(){
    const { time, isSec } = this.state;
    if(isSec){
      return time/60;
    }else{
      return time;
    }
  }
  handleMinChange = (e) => {
    const val = e.target.value;
    this.setState({
      time: val,
      isSec: false
    })
  }
  handleSecChange = (e) => {
    const val = e.target.value;
    this.setState({
      time: val,
      isSec: true
    })
  }
  render(){
    return (
      <div>
        <label>
          Seconds:<input type="text" ref={el => this.sec} onChange={this.handleSecChange} value={this.calculateSec()}/>
        </label>
        <label>
          Minutes :<input type="text" ref={el => this.min} onChange={this.handleMinChange} value={this.calculateMin()}/>
        </label>
      </div> 
    )
  }
}