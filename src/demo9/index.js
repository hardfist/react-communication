import React, { Component } from 'react';
import ReactDOM from  'react-dom';
class A extends Component{
  constructor(){
    super();
    this.name = 'this is a'
    this.state = { 
      name: 'this is b'
    }
  }
  renderPortal(){
    const div = document.createElement('div');
    document.body.appendChild(div);
    const children = React.cloneElement(this.props.children,{});
    //ReactDOM.unstable_renderSubtreeIntoContainer(this,children,div);
    ReactDOM.render(children,div);
  }
  componentDidMount() {
    this.renderPortal();
  }
  
  render(){
    return (
        <div>A holder </div>
    )
  }
}

class C extends Component{
  constructor(){
    super();
    this.state = {
      cnt: 1
    }
    setInterval(() => {
      this.setState((state) => {
        return {cnt: state.cnt+1}
      })
    },1000)
  }
  render(){
    console.log(this.props,this.state,this.context);
    return <div>children:{this.state.cnt} {this.props.cnt}</div>
  }
}
export default class B extends Component{
  constructor(){
    super();
    this.state = {
      cnt: 1
    }
    setInterval(() => {
      this.setState((state) => {
        return {cnt: state.cnt+1}
      })
    })
  }
  render(){
    return(
      <A>
        <C cnt={this.state.cnt}/>
      </A>
    )
  }
}

