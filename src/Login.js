import React, { Component } from 'react';
import ReactModalLogin from 'react-modal-login';
import RegisterService from './RegisterService';
import LoginService from './LoginService';


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loggedIn: null,
      loading: false,
      error: null,
      initialTab: null,
      recoverPasswordSuccess: null,
    };
    this.LoginService = new LoginService();
    this.RegisterService = new RegisterService();

  }

  openModal(initialTab) {
    this.setState({
      initialTab: initialTab
    }, () => {
      this.setState({
        showModal: true,
      })
    });
  }

  onLoginSuccess(method, response) {
    this.closeModal();
    this.setState({
      loggedIn: method,
      loading: false
    })
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null
    });
  }

  onLogin() {
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
    this.LoginService.login(user,password)
      .then((res) => {
          if(res.status === 200){
            window.location.replace('http://localhost:3000/landmark')
          }
        }
      )
      .catch(err =>{
        alert("Not found error, probably credentials incorrect");
      })
  }

  onRegister() {
    console.log('__onRegister__');
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;
    this.RegisterService.register(user,password)
      .then((res) => {
          if(res.status === 200){
            window.location.replace('http://localhost:3000/landmark')
          }
        }
      )
      .catch(err =>{
        alert("Forbidden error, this user already exists!");
      })
  }

  render() {
    return (
      <main>
        <div>
          <ReactModalLogin
            visible={true}
            onCloseModal={this.closeModal.bind(this)}
            form={{
              onLogin: this.onLogin.bind(this),
              onRegister: this.onRegister.bind(this),
              loginBtn: {
                label: "Sign in"
              },
              registerBtn: {
                label: "Sign up"
              },

              loginInputs: [
                {
                  containerClass: 'RML-form-group',
                  label: 'User',
                  type: 'user',
                  inputClass: 'RML-form-control',
                  id: 'user',
                  name: 'user',
                  placeholder: 'user',
                },
                {
                  containerClass: 'RML-form-group',
                  label: 'Password',
                  type: 'password',
                  inputClass: 'RML-form-control',
                  id: 'password',
                  name: 'password',
                  placeholder: 'Password',
                }
              ],
              registerInputs: [
                {
                  containerClass: 'RML-form-group',
                  label: 'User',
                  type: 'user',
                  inputClass: 'RML-form-control',
                  id: 'user',
                  name: 'user',
                  placeholder: 'user',
                },
                {
                  containerClass: 'RML-form-group',
                  label: 'Password',
                  type: 'password',
                  inputClass: 'RML-form-control',
                  id: 'password',
                  name: 'password',
                  placeholder: 'Password',
                }
              ]
            }}
          />
        </div>
      </main>
    )
  }
}

export default Login;
