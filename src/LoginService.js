import axios from 'axios';

export default class LoginService {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8899';
  }
  login(user, pass) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    };
    return axios.post(`${this.domain}/login`,
      {
        user: user,
        pass: pass
      }, config)
      .then((response) => {
        if(response.status === 200){
          localStorage.setItem('landmark-auth', response.data.message);
          localStorage.setItem('landmark-auth-user', user);
          localStorage.setItem('landmark-auth-pass', pass);
        }
        return response
      })
  }
}
