import axios from 'axios';

export default class NotesService {
  getNotes() {
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
    return axios.get('http://localhost:8899/notes/all', config)
      .then((response) => {
        return response.data
      })
  }
  addNote(note){
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
    return axios.post('http://localhost:8899/note',
      {
        "user":localStorage.getItem('landmark-auth-user'),
        "lat":parseFloat(localStorage.getItem('current-lat')),
        "lng": parseFloat(localStorage.getItem('current-lng')),
        "note":note
      }, config)
      .then((response) => {
        console.log(response);
        if(response.status === 200){
          console.log("Worked")
        }
        return response
      });
  }
}
