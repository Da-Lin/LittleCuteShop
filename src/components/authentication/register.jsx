import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { register } from '../../store/actions/authenticationAction'

class Register extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  }

  //set state when user enters credencials
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  //register new user and add this user to database
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.register(this.state);
  }

  render() {
    const { auth, authError } = this.props;

    //if logged in user, redirect to main page
    if (auth.uid) return <Redirect to='/' /> 
    return (
      <div className="container">
        <form className="white" onSubmit={this.handleSubmit}>
          <h5 className="grey-text text-darken-3">Register</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id='firstName' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id='lastName' onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <button className="btn black lighten-1 z-depth-0">Register</button>
            <div className="center red-text">
              { authError ? <p>{authError}</p> : null }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    register: (creds) => dispatch(register(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)