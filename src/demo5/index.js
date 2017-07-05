import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class Nav extends Component{
  constructor(){
    super();
    document.addEventListener('getEditorState',(e) => {
      this.editor = e.detail.editor;
    })
    document.addEventListener('updateSaveStatus',(e)=>{
      this.saveStatus = e.detail.saveStatus;
      this.forceUpdate();
    })
  }
  render(){
    return (
      <div>
        status:{this.saveStatus}
      </div>
    )
  }
}
class Editor extends Component{
  constructor(){
    super();
    this.state = {
      value: '',
      saveStatus: '',
      isPublishing: false
    }
  }
  componentDidMount() {
    const event = new CustomEvent('getEditorState',
      {
        detail :{
          editor: this
        }
      }
    );
    document.dispatchEvent(event);
  }
  updateStatus(status){
    const event = new CustomEvent('updateSaveStatus',
      {
        detail:{
          saveStatus: status
        }
      }
    );
    document.dispatchEvent(event);
  }
  isValidate(){
    const { value } = this.state;
    return value.length > 10;
  }
  notifyTextChange(state){
    this.updateStatus('saving');
    setTimeout(() => {
      this.updateStatus('saved')
    },2000)
  }
  handleTextChange(e){
    const value = e.target.value;
    this.setState({
      value
    },this.notifyTextChange.bind(this))
  }
  render(){
    return (
    <div className="editor">
      <input type="text" value={this.state.value} onChange={this.handleTextChange.bind(this)}/>
    </div>
    );
  }
}

export default class App extends Component{
  componentDidMount(){
    ReactDOM.render(<Editor/>,this.editor);
    ReactDOM.render(<Nav/>,this.nav);
  }
  render(){
    return (
      <div>
        <div id="nav" ref={el => this.nav = el} />
        <div id="editor" ref={el => this.editor= el} />
      </div>
    );
  }
}