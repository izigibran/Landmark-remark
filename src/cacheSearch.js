import queryString  from 'query-string';

export function  searchSet(searchParams){
  const parsed = queryString.parse(searchParams);
  if(parsed.lat && parsed.lng && parsed.user) {
    localStorage.setItem('searchLat', parsed.lat);
    localStorage.setItem('searchLng', parsed.lng);
    localStorage.setItem('searchUser', parsed.user);
  }
}
export function searchLat(){
  return parseFloat(localStorage.getItem('searchLat'));
}
export function searchLng (){
  return parseFloat(localStorage.getItem('searchLng'));
}

export function searchUser (){
  return localStorage.getItem('searchUser');
}

export function  searchReset (){
  localStorage.removeItem('searchLat');
  localStorage.removeItem('searchLng');
  localStorage.removeItem('searchUser');
}




