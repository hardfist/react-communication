import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Editor, EditorState } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.config2state(props.config);
  }
  // 只允许内部state变化触发render，禁止外部props变化触发更新以维护内部状态。
  shouldComponentUpdate(nextProps, nextState) {
    let update = false;
    const { title: nextTitle, editorState: nextEditorState } = nextState;
    const { title, editorState } = this.state;
    if(title !== nextTitle) {
      update = true;
    }
    if(editorState !== nextEditorState) {
      update = true;
    }
    return update;
  }
  componentWillReceiveProps(nextProps) {
    this.reloadFromConfig(nextProps.config);
  }
  _notifyArticleChange = () => {
    const { editorState, title } = this.state;
    const content = this._draft2html(editorState);
    this.props.onArticleChange({
      title,
      content
    });
  }
  _html2draft(html) {
    const contentState = convertFromHTML({
      htmlToBlock: (nodeName, node) => {
        if (nodeName === 'blockquote') {
          return {
            type: 'blockquote',
            data: {}
          };
        }
      }
    })(html);
    return EditorState.createWithContent(contentState);
  }
  _draft2html(editorState) {
    const html = convertToHTML({
      blockToHTML: (block) => {
        if (block.type === 'PARAGRAPH') {
          return <p />;
        }
      }
    })(editorState.getCurrentContent());
    return html;
  }
  onChangeTitle = (e) => {
    const title = e.target.value;
    this.setState({
      title
    },this._notifyArticleChange)
  }
  onChangeContent = (editorState) => {
    this.setState({
      editorState
    },this._notifyArticleChange)
  }
  reloadFromConfig(config){
    this.setState(this.config2state(config))
  }
  config2state(config){
    const { article: { content, title } } = config;
     return {
      editorState: this._html2draft(content),
      title
    }
  }
  render() {
    return (
      <div className="Editor-root">
        <input type="text" value={this.state.title} onChange={this.onChangeTitle} />
        <Editor editorState={this.state.editorState} onChange={this.onChangeContent} />
      </div>
    );
  }
}

export default class extends Component{
  constructor(){
    super();
    this.article = {
      content: "<p>this is content</p>",
      title: "this is title"
    }
  }
  onArticleChange = (article) => {
    console.log('article:',article);
  }
  reload= ()=> {
    this.editorInstance.reloadFromConfig({
      article: this.article
    })
  }
  reload2 = () => {
    this.forceUpdate();
  }
  render(){
    return (
      <div>
        <button onClick={this.reload}>reload</button>
        <button onClick={this.reload2}>reload2</button>
        <RichEditor config={{article: this.article}} onArticleChange={this.onArticleChange} ref={ el => this.editorInstance = el } />
      </div>
    )
  }
}