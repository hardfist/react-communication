import React, { Component } from 'react';
// 全局事件通信
class ListItem extends Component{
  handleClick(e){
    const { id } = this.props;
    const event = new CustomEvent('changeItem',{
      detail:{
        id
      }
    });
    document.dispatchEvent(event);
  }
  render(){
    const { text, checked } = this.props;
    return (
        <div className="list-item">
          {text}: <input type="radio" checked={checked} onClick={this.handleClick.bind(this)}/>
        </div>
      )
  }
}
export default class List extends Component{
  constructor(){
    super();
    this.state = {
      list: [
        {
          text: 'text1',
          checked: false,
          id:1
        },
        {
          text: 'text2',
          checked: false,
          id:2
        }
      ]
    }
  }
  componentDidMount() {
    document.addEventListener('changeItem',this.handleItemChange.bind(this));
  }
  handleItemChange(e){
    const { id } = e.detail;
    const { list } = this.state;
    list.forEach(item => {
      if(item.id === id){
        item.checked = !item.checked
      }
    })
    this.setState({
      list
    });
  }
  render(){
    const { list } = this.state;
    const listDom = list.map((item,index) => {
      const { text, checked, id } = item;
      return <ListItem text={text} checked={checked} key={id} id={id}/>
    })
    return (
      <div className="list">
        {listDom}
      </div>
    )
  }
}
