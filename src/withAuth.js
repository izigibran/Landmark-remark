import React, { Component } from 'react';
import Login from './Login';
export default function withAuth(AuthComponent) {
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        auth: null
      }
    }
    getAuth = () => {
      return localStorage.getItem('landmark-auth')
    };
    componentWillMount() {
      if(this.getAuth()){
        this.setState({
          auth: true
        })
      }
    }
    render() {
      if (this.state.auth) {
        return (
          <AuthComponent history={this.props.history}
          />
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
