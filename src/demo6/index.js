import React, { Component } from 'react';

class Demo extends Component{
  constructor(props){
    super(props);
    this.cnt = this.props.cnt;
    this.config = this.props.cnt;
    this.state = {
      cnt: 0
    }
  }
  componentWillReceiveProps(nextProps) {
    const { cnt } = nextProps;
    this.setState({
      cnt
    })
    this.cnt = cnt;
  }
  render(){
    return (
      <div>
        <div>state: { this.state.cnt }</div>
        <div>immutableProps: { this.props.config }</div>
        <div>mutableProps: { this.props.cnt}</div>
        <div>localState: { this.cnt }</div>
      </div>
    )
  }
}
export default class App extends Component{
  constructor(){
    super();
    this.state = {
      cnt: 0
    }
  }
  handleChange = (e) => {
    this.setState({
      cnt: e.target.value
    });
  }
  render() {
    return (
      <div>
        <input type="text" value={this.state.cnt} onChange={this.handleChange}/>
        <Demo cnt={this.state.cnt}/>
      </div>
    )
  }
}