# React实践填坑记

项目重构中碰到了很多组件通信带来的问题，对组件通信进行总结。

react组件通信有几种常见的场景

+ 父子组件通信([Demo1](https://github.com/hardfist/react-communication/tree/master/src/demo1))：父子组件通信最为简单，父组件向子组件传递props，子组件接受父组件的回调
+ 跨级组件通信([Demo2](https://github.com/hardfist/react-communication/tree/master/src/demo2))：（使用Context，典型的是Redux)
+ 兄弟组件通信([Demo3](https://github.com/hardfist/react-communication/tree/master/src/demo3)) ：在父组件维护state，兄弟组件接受props，兄弟组件修改父组件state。redux way
+ 全局事件通信([Demo4](https://github.com/hardfist/react-communication/tree/master/src/demo3))：全局事件需要保证派发事件时，监听者必须存在，否则可能会导致监听不到事件的发生，两种解决方式，double check，或者监听DomContentLoaded之后再进行事件派发，保证监听者已经存在。

以上是几种最基本的情形，但现实中还是可能存在种种问题。

## UI渲染不同步

要把数据同步到UI总共分两步
1. 触发组件的render方法
2. render方法根据最新的props，state更新UI

如果发现UI和数据不同步，则可能是1.没有触发render，2.render方法里的渲染的数据源不是最新的

### 触发render的条件

1. First Render:    首次渲染不会进行SCU检查，肯定会render

2. forceUpdate：会跳过SCU检查，强制调用render（下个版本语义可能发生变化，不能保证一定会调用render）

3. stateChange:  setState && (!SCU || SCU()) 组件没有实现SCU或组件的SCU返回true。

   > React的Component默认没有实现SCU，所以如果组件没有实现SCU，那么setState一定会导致render，
   >
   > 而react-redux实现了组件的shouldComponentUpdate（浅比较），所以如果使用setState时，直接修改的原对象，redux组件并不能保证会触发render，这点要特别注意。

4. propChange: 父组件render导致调用子组件的render或者调用ReactDOM.render && （！SCU || SCU）,这都会触发WillReceiveProps。SCU这块逻辑和setState一致

> 对于stateChange和propChange，并不能保证state和prop发生了改变，仅仅是触发了该生命周期而已，prop是否发生改变需要用户自己去进行检查（涉及deepEqual),如果对象嵌套过深，则需考虑Immutable对象，减小deepEqual代价。

### 数据更新

render函数里渲染的数据可能分为四种([Demo6](https://github.com/hardfist/react-communication/tree/master/src/demo6))。

+ this.state
+ this.props.mutable
+ this.props.immutable（如'defaultValue'）
+ this.instanceVariable

如果render函数里同时包含这四种数据，则需要注意数据更新时，及时触发render进行更新，因为React并不会自动的为这些数据更新调用render函数。

##### 常见问题

+ 如instanceVariable在构造函数里根据props进行初始化，当props发生变化时instanceVariable并未进行重新计算，导致渲染出错。解决方式是1.在willReceiveProps里重新计算instanceVariable，2.不使用instanceVariable,而是在render里计算得到。

## 非受控组件

暂时我们进行如下定义([Demo7](https://github.com/hardfist/react-communication/tree/master/src/demo7))：

+ 受控组件：组件的状态维护在组件外部，组件响应props的变化，并提供向外派发命令的接口。
+ 非受控组件：组件状态维护在组件内部，组件只根据config进行初始化，后续不响应props的变化，并提供向外的onChange接口。
+ 混杂组件：组件的状态既有一部分维护在外部，也有一部分维护在内部,因此需要同步状态（双向绑定）。

受控组件和非受控组件都是单向数据流，受控组件数据流方向自外向内，非受控组件数据流方向自内向外，较为容易管理。而对于混杂组件，由于内部和外部都维护状态，要处理好状态同步，尤其在存在异步的环境下（如Redux），很容易出现问题，所以不建议使用。

React官方建议大多数场景下应该使用受控组件，在某些场景下非受控组件也有其独特优势。

受控组件要求将组件状态维护在组件外部，一方面对于一些较复杂的组件，可能涉及很多的状态变量，放在外部维护会加重外部组件负担和造成组件的接口比较复杂。另一方面一些第三方插件封装为非受控组件也比受控组件更为容易。

topbuzz的编辑器内部业务就较为复杂（涉及图片视频的上传，编辑器的编辑、存储、发布、预览、存草稿，草稿撤销功能等）。因此考虑将其封装为非受控组件。

设计如下：编辑器只在首次mount的时候根据传入的config初始化编辑器状态，后续的编辑器编辑时的状态均维护在组件内部，编辑器向外暴露notifyArticleChange接口。

这种方式，使用者仅仅需要传入初始的值和onArticleChange回调即可使用编辑器，而不需要关心编辑器内部的数据存储格式。

然而需求是不断变动的，产品后来提了给需求，需要编辑器支持重新载入新内容功能，这也就要求我们的编辑器能够重新根据新的config重新载入编辑器内容。

存在下面两种方案([Demo8](https://github.com/hardfist/react-communication/tree/master/src/demo8))

1. 编辑器向外提供重新载入接口loadFromConfig，外部需要重新载入时通过调用editorInstance.loadFromConfig(newConfig)即可。
2. 编辑器在willReceiveProps中响应config里article的变化，重新初始化state。该方案存在的问题是父组件的render会触发willReceiveProps，造成错误的初始化state。根源在于此时编辑器的state即维护在内部，又受到外部影响，会造成内外状态不一致。



相关代码[react-communication](https://github.com/hardfist/react-communication)








