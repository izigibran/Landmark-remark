import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import Modal from "react-responsive-modal";

import withAuth from './withAuth';
import NotesService from './NotesService';
import SearchService from './SearchService';
import {getHost} from './const'
import {searchReset, searchLat, searchLng, searchSet, searchUser} from './cacheSearch'

const modalStyle = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const mapStyles = {
  width: '100%',
  height: '100%'
};

const backLandMark = {
  "background": "red",
  "border-radius": "8px",
  "color": "white",
  "width": "9%",
  "height": "5%",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lat: 1, lng: 0 },
      notes: [],
      all_notes:[],
      currentUserMarker: '',
      current_location:{
        lat: 0,
        long: 0
      },
      openNotesModal: false,
      showList: false,
      showNoteWrite: false,
      showSearch: false,
      showResultLocationZoom: false,
      value: '',
      searchValueUser: '',
      searchValueNote: '',
      searchResultNo: 0,
      searchResultNotes: [],
      selectedRadio: 'user'
    };
    this.addNote = this.addNote.bind(this);
    this.searchNote = this.searchNote.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateInputSearchNote = this.updateInputSearchNote.bind(this);
    this.updateInputSearchUser = this.updateInputSearchUser.bind(this);
    this.NotesService = new NotesService();
    this.SearchService = new SearchService();
  }

  onCloseNotesModal = () => {
    this.setState({ openNotesModal: false });
    this.setState({ showList: false });
    this.setState({ showNoteWrite: false });
    this.setState({ showSearch: false });
    this.setState({ searchResultNo: 0 });
    this.setState({ searchResultNotes: [] });
    window.location.replace(`${getHost()}/landmark`)
  };

  componentWillMount() {
    searchSet(this.props.history && this.props.history.location.search);
    if(searchLat() && searchLng() && searchUser()) this.setState({ showResultLocationZoom: true });
    this.getLocation();
    this.NotesService.getNotes().then(response =>{
      this.setState({ all_notes:response.user_notes });
    });
  }

  handleLogOut =() => {
    //Remove Local storage and redirect to index
    localStorage.removeItem('landmark-auth');
    localStorage.removeItem('landmark-auth-user');
    localStorage.removeItem('landmark-auth-pass');
    localStorage.removeItem('current-lng');
    localStorage.removeItem('current-lat');
    window.location.replace(`${getHost()}/landmark`)
  };

  getLocation = () => {
    //Location is very slow and unreliable that for the purpose of showing  my current location
    //I save my lng and lat locally (assuming the location does not change so often on a desktop user
    //The location is still getting updated if location changes though, could take some time but it should update
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(position => {
        let location = { lat: position.coords.latitude, lng: position.coords.longitude };
        if(!localStorage.getItem('current-lat') ||location.lat !== localStorage.getItem('current-lat') ){
          localStorage.setItem('current-lat', location.lat) ;
        }
        if(!localStorage.getItem('current-lng') ||location.lng !== localStorage.getItem('current-lng') ){
          localStorage.setItem('current-lng',location.lng);
        }
        this.setState({
          current_location: {lat:localStorage.getItem('current-lat'), lng: localStorage.getItem('current-lng')}
        });
      })
    } else {
      alert("You need to have the location feature");
    }
  };

  showNotesResult(map, maps, locationNote, self){
      let marker =  new maps.Marker({
        position: {lat: searchLat(), lng:searchLng() },
        map,
        icon: {
          labelOrigin: new maps.Point(19,64),
          url: "https://drive.google.com/uc?id=0B3RD6FDNxXbdVXRhZHFnV2xaS1E"
        },
        title:"Notes",
        label: {
          text: "Notes",
          color: "black",
          fontWeight: "bold",
          fontSize: "16px"
        }
      });

      maps.event.addListener(marker, 'click', function () {
        self.setState({ openNotesModal: true });
        self.setState({ showList: true });
        self.setState({ currentUserMarker: locationNote.user });
        self.setState({ notes: locationNote.notes })
      });

      map.setZoom(15);
      map.panTo(marker.position);
      //Reset query string on url after result focus
      window.history.pushState({}, null,  `${getHost()}/landmark`);
      //Reset search cache
      searchReset();
  }

  buildMap(map, maps) {

    //Get instance of context to pass to click listeners for markers
    const self = this;

    if(searchLat() && searchLng() && searchUser) {

      const note = this.state.all_notes.find(n => n.lat =searchLat() && n.lng === searchLng() && n.user === searchUser());
      this.showNotesResult(map, maps, note, self)

    } else {
      //Marker of current location
      new maps.Marker({
        position: {lat:parseFloat(localStorage.getItem('current-lat')), lng: parseFloat(localStorage.getItem('current-lng'))},
        map,
        icon: {
          labelOrigin: new maps.Point(19,64),
          url: "https://i.ibb.co/SBmGrLX/Location.png"
        },
        title:"My current location"
      });


      //Build the note markers of users
      this.state.all_notes.forEach(loc =>{
        const userText = (loc.user === localStorage.getItem('landmark-auth-user'))? `${loc.user} (My notes)` : loc.user;
        let marker = new maps.Marker({
          position: loc,
          map,
          icon: {
            labelOrigin: new maps.Point(16,64),
            url: "https://drive.google.com/uc?id=0B3RD6FDNxXbdVXRhZHFnV2xaS1E"
          },
          notes: loc.notes,
          label: {
            text: userText,
            color: "black",
            fontWeight: "bold",
            fontSize: "16px"
          }
        });
        maps.event.addListener(marker, 'click', function () {
          self.setState({ openNotesModal: true });
          self.setState({ showList: true });
          self.setState({ currentUserMarker: marker.label.text });
          self.setState({ notes: marker.notes })
        });
      });

      let markerSearch = new maps.Marker({
        position: {lat:-26.190810, lng:-110.013226}, // this position is hardcoded, ideally it should be calculated but it will be in the ocean so unlikely to overlap an users position
        map,
        icon: {
          labelOrigin: new maps.Point(19,64),
          url: "https://i.ibb.co/xG32Rr6/Search.png"
        },
        label: {
          text: "Search",
          color: "black",
          fontWeight: "bold",
          fontSize: "10px"
        }
      });

      maps.event.addListener(markerSearch, 'click', function () {
        self.setState({ openNotesModal: true });
        self.setState({ showSearch: true });
      });

      //Create a marker that displays modal that contains an input form
      //This is to handle add notes (on my location)
      let markerMenu = new maps.Marker({
        position: {lat:-38.190810, lng:-110.013226}, // this position is hardcoded, ideally it should be calculated but it will be in the ocean so unlikely to overlap an users position
        map,
        icon: {
          labelOrigin: new maps.Point(19,64),
          url: "https://i.ibb.co/XV1yrPv/write.png"
        },
        label: {
          text: "Add note (on my location)",
          color: "black",
          fontWeight: "bold",
          fontSize: "10px"
        }
      });
      maps.event.addListener(markerMenu, 'click', function () {
        self.setState({ openNotesModal: true });
        self.setState({ showNoteWrite: true });
      });

      let markerLogOut = new maps.Marker({
        position: {lat:-48.190810, lng:-110.013226}, // this position is hardcoded, ideally it should be calculated but it will be in the ocean so unlikely to overlap an users position
        map,
        icon: {
          labelOrigin: new maps.Point(19,64),
          url: "https://i.ibb.co/WtGmtcg/logout.png"
        },
        label: {
          text: "Log Out",
          color: "black",
          fontWeight: "bold",
          fontSize: "10px"
        }
      });

      maps.event.addListener(markerLogOut, 'click', function () {
        self.handleLogOut()
      });

    } //End else

  }

  addNote(e) {
    e.preventDefault();
    if(this.state.value) {
      this.NotesService.addNote(this.state.value).then(response =>{
        return response
      }).then(()=>{
        const addForm = document.getElementsByName('add-note')[0];
        addForm.reset();
        alert("Note added!");
        this.setState({ value: ''});
      }).catch(e =>{
        alert("Error, most likely location has not been set, please try on firefox");
      });
    }
  }

  resetSearch(){
    const searchForm = document.getElementsByName('search-note')[0];
    searchForm.reset();
  }

  async searchNote(e) {
    e.preventDefault();
    if(this.state.searchValueUser) {
      const result = await this.SearchService.getUserNotes(this.state.searchValueUser);
      this.setState({ searchValueUser: ''});
      if(result.length === 0) {
        alert("No search results !");
      } else {
        this.setState({ searchResultNo: result.length});
        this.setState({ searchResultNotes: result});
      }
    } else if (this.state.searchValueNote){
      const result = await this.SearchService.getTextNotes(this.state.searchValueNote);
      if(result.length === 0) {
        alert("No search results !");
      } else {
        this.setState({ searchResultNo: result.length});
        this.setState({ searchResultNotes: result});
      }
    }
    this.resetSearch()
  }

  updateInput(e){
    this.setState({ value: e.target.value });
  }

  updateInputSearchNote(e){
    this.setState({ searchValueNote: e.target.value });
  }

  updateInputSearchUser(e){
    this.setState({ searchValueUser: e.target.value });
  }

  renderModals(notes, currentMarker){
    if (this.state.showList) {
      return(
        <div>
          <br/>
          <br/>
          <h2>{`Notes by: ${currentMarker}`}</h2>
          <br/>
          {notes.map(note => (
            <div>
              <br/>
              <p>
                {note}
              </p>
            </div>
          ))}
        </div>
      );
    } else if (this.state.showNoteWrite) {
      return(<div>
        <br/>
        <br/>
        <h2>{`Add a note on my current location`}</h2>
        <form name="add-note" onSubmit={this.addNote}>
          <input type="text" onChange={this.updateInput} /><br/><br/>
          <input type="submit" value="Add note"/>
        </form>
      </div>)
    } else if(this.state.showSearch){
      return(<div>
        <br/>
        <br/>
        <h2>{`Search for a note`}</h2>
        <form name="search-note" onSubmit={this.searchNote} >
          <input type="text"  placeholder="By user..." onChange={this.updateInputSearchUser} /><br/><br/>
          <input type="text"  placeholder="By note..." onChange={this.updateInputSearchNote} /><br/><br/>
          <input type="submit" value="Search"/>
        </form>
        {(this.state.searchResultNo > 0 )?
          <div>
            <br/>
            <br/>
            <h2>{`Search Result: ${this.state.searchResultNo}`}</h2>
            <br/>
            <div>
              <ul>
                {this.state.searchResultNotes.map(function(note, idx){
                  const notesLink = `${getHost()}/landmark?lat=${note.lat}&lng=${note.lng}&user=${note.user}`;
                  return (<li key={idx}>
                    {`Notes of user: ${note.user} at location  [${note.lat}, ${note.lng}] `},
                    <a href={notesLink}>View</a></li>)
                })}
              </ul>
            </div>
          </div>
          :''}
      </div>)
    }
  }

  render() {
    const { openNotesModal, showResultLocationZoom } = this.state;
    return (
        <main>
          <div style={modalStyle}>
          <Modal open={openNotesModal} onClose={this.onCloseNotesModal}>
            {this.renderModals(this.state.notes, this.state.currentUserMarker)}
          </Modal>
         </div>
          <div>
            <GoogleMap
              style={mapStyles}
              bootstrapURLKeys={{key: 'AIzaSyAptoEhIrPGU6QLb9h3wi2VCiFOfENH_sM'}}
              defaultCenter={{lat: this.state.center.lat, lng: this.state.center.lng}}
              defaultZoom={1}
              yesIWantToUseGoogleMapApiInternals={true}
              onGoogleApiLoaded={({map, maps}) => {
                this.buildMap(map, maps);
              }}>
              {showResultLocationZoom && <button style={backLandMark} onClick={(e) => {
                window.location.replace(`${getHost()}/landmark`)
              }} >
                Back to Landmark
              </button>}
            </GoogleMap>
          </div>
        </main>
      )
  }
}
export default withAuth(App);
