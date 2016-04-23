import ReactDom from 'react-dom'
import React from 'react'

export default class Modal extends React.Component {
  render() {
    return(
      <div className='modal'>
        <h3 className='modal-name'>
          {this.props.name}
        </h3>
        {this.props.children}
      </div>
    );
  }
}
