import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions'

import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button';


import classes from './Auth.css'

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail address'
        },
        value: '',
        valitation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        valitation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSingup: true
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].valitation),
        touched: true
      }
    };
    this.setState({ controls: updatedControls })
  }

  submitHandler = (event) => { 
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSingup);
  }

  switchAuthModeHandler = () => { 
    this.setState(prevState => {
      return {
        isSingup: !prevState.isSingup
      }
    });
  }

  render() {
    const formElementsArr = [];

    for (const key in this.state.controls) {
      formElementsArr.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArr.map(formElement => {
      return (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          shouldValidate={formElement.config.valitation}
          invalid={!formElement.config.valid}
          touched={formElement.config.touched}
          changed={(event) => this.inputChangedHandler(event, formElement.id)} />
      );
    });

    return (
      <div className={classes.Auth}>
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType='Success'>SUBMIT</Button>
        </form>
        <Button
          clicked={this.switchAuthModeHandler}  
          btnType='Danger'>SWITCH TO {this.state.isSingup ? 'SINGIN' : 'SINGUP'}</Button>
        
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSingup) => dispatch(actions.auth(email, password, isSingup))
  }
}

export default connect(null,mapDispatchToProps)(Auth);