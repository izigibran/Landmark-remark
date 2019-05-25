import React, { Component } from 'react';
import Login from './Login';
export default function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    render() {
      if (localStorage.getItem('landmark-auth')) {
        return (
          <AuthComponent history={this.props.history}/>
        )
      }
      else {
        return (
          <Login/>
        )
      }
    }
  }
}
