import axios from 'axios';

export default class RegisterService {
  constructor(domain) {
    this.domain = domain || 'http://localhost:8899';
  }
  register(user, pass) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      }
    };
    return axios.post(`${this.domain}/sign-up`,
      {
        user: user,
        pass: pass
      }, config)
      .then((response) => {
        if(response.status === 200){
          localStorage.setItem('landmark-auth', 'authorized');
          localStorage.setItem('landmark-auth-user', user);
          localStorage.setItem('landmark-auth-pass', pass);
        }
        return response
      })
  }
}
