import React, { Component } from 'react';
import { createStore, combineReducers, bindActionCreators } from 'redux';
import { connect , Provider }  from 'react-redux';

// 跨级通信（使用redux)
const initialState = {
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
const TOGGLE_ITEM = 'TOGGLE_ITEM';
function listReducer(state = initialState,action){
  switch(action.type){
    case TOGGLE_ITEM:
      const list = state.list.map((item,index) => {
        if(item.id === action.id){
          return {
            ...item,
            checked: !item.checked
          }
        }else{
          return {...item}
        }
      })
      return {
        ...state,
        list
      }
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  list: listReducer
});
const toggleItem = (id) =>({
  type: TOGGLE_ITEM,
  id
});

const store = createStore(rootReducer);



class ListItem extends Component{
  handleClick(){
    const { handleItemClick } = this.props;
    handleItemClick();
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

class List extends Component{
  handleItemClick(id){
    const { actions } = this.props;
    actions.toggleItem(id);
  }
  render(){
    const { list } = this.props;
    const listDom = list.map((item,index) => {
      const { text, checked, id } = item;
      return <ListItem text={text} checked={checked} key={id} handleItemClick={this.handleItemClick.bind(this,id) } />
    })
    return (
      <div className="list">
        {listDom}
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    ...state.list
  }
}
function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators({
      toggleItem
    },dispatch)
  }
}
List = connect(mapStateToProps,mapDispatchToProps)(List);
export default class App  extends Component{
  render(){
    return (
      <Provider store={store}>
        <List/>
      </Provider>
    )
  }
}