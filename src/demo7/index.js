import React, { Component } from 'react';

class Controlled extends Component{
  handleClick =  () => {
    this.props.dispatchIncrement();
  }
  render(){
    return <button onClick={this.handleClick}>{this.props.value}</button>
  }
}

class Uncontrolled extends Component{
  constructor(props){
    super(props);
    const { initValue } = this.props;
    this.state = {
      value: initValue
    }
  }
  handleClick = (e) => {
    const { value } = this.state;
    const newValue = value+1;
    this.setState({
      value: newValue
    });
    this.props.onChange(newValue);
  }
  render(){
    return <button onClick={this.handleClick}>{this.state.value}</button>
  }
}

class Hybrid extends Component{
  constructor(props){
    super(props);
    const { value = 0 } = this.props;
    this.state = {
      value
    }
  }
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({
      value
    })
  }
  handleClick = (e) => {
    const { value } = this.state;
    const newValue = value+1;
    this.setState({
      value: newValue
    })
    this.props.dispatchIncrement(newValue);
  }
  render(){
    return <button onClick={this.handleClick}>{this.state.value}</button>
  }
}

export default class extends Component {
  constructor(){
    super();
    this.state = {
      value: 0
    }
  }
  Increment = () => {
    this.setState({
      value: this.state.value+1
    });
  }
  getInfo = (value) => {
    console.log('value:',value);
  }
  synState = (newValue) => {
    this.setState({
      value: newValue
    });
  }
  asynState = (newValue) => {
    setTimeout(() => {
      this.setState({
        value: newValue
      });
    }, 1000);
  }
  render(){
    return (
      <div>
        <button onClick={this.Increment}>{this.state.value}</button>
        <div>
          Controlled: <Controlled value={this.state.value} dispatchIncrement={this.Increment}/>
        </div>
        <div>
          Uncontrolled: <Uncontrolled initValue={this.state.value} onChange={this.getInfo} />
        </div>
        <div>
          Hybrid（Sync): <Hybrid value={this.state.value} dispatchIncrement={this.Increment} onChange={this.synState}/>
        </div>
        <div>
          Hybrid(Async): <Hybrid value={this.state.value} dispatchIncrement={this.Increment} onChange={this.asynState}/>
        </div>
      </div>
    )
  }
}