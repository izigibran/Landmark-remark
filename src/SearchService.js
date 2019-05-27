import axios from 'axios';

export default class SearchService {
  getUserNotes(user) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      auth: {
        username: localStorage.getItem('landmark-auth-user'),
        password: localStorage.getItem('landmark-auth-pass')
      },
    };
    return axios.get(`http://localhost:8899/search/user/notes/${user}`, config)
      .then((response) => {
        return response.data
      })
  }
  getTextNotes(text) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      auth: {
        username: localStorage.getItem('landmark-auth-user'),
        password: localStorage.getItem('landmark-auth-pass')
      },
    };
    return axios.get(`http://localhost:8899/search/notes/${text}`, config)
      .then((response) => {
        return response.data
      })
  }
}
