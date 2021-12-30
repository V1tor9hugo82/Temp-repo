import P from 'prop-types'
//import { Component } from 'react';
import './style.css';

export class Button extends Component {

  render() {
    const { text, onClick, disabled = false } = this.props;

    return (
      <button
        className='button'
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    )
  }
}

Button.defaultProps = {
  disabled: false,
}

Button.propTypes = {
  text: P.string.isRequired,
  onClick: P.func.isRequired,
  disabled: P.bool,
}
