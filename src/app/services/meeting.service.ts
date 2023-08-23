import { Injectable } from '@angular/core';
import { IMeeting } from '../interfaces/meeting.interface';

@Injectable({
  providedIn: 'root'
})

export class MeetingService {

  private _localStorageName = 'payever-ls-calendar';

  addLocalStorageMeeting(newMeeting: IMeeting): void {
    let localStorageObj = JSON.parse( <string>localStorage.getItem(this._localStorageName) );
    if ( localStorageObj !== null ){
      localStorageObj.push(newMeeting);
      localStorage.setItem( this._localStorageName, JSON.stringify(localStorageObj) );
    } else {
      localStorage.setItem( this._localStorageName, `[${JSON.stringify(newMeeting)}]` );
    }
  }

  deleteMeeting(obj: IMeeting): void {
    let localStorageObj = JSON.parse( <string>localStorage.getItem(this._localStorageName) );
    const newArray: IMeeting[] = [];
    localStorageObj.forEach( (item: IMeeting) => {
      if (item.id !== obj.id){
        newArray.push(item);
      }
    } )
    localStorage.setItem( this._localStorageName, JSON.stringify(newArray) );
  }

  getAllMeetings(): IMeeting[] {
    return JSON.parse( <string>localStorage.getItem(this._localStorageName) );
  }

  updateMeeting(obj: IMeeting): void {
    let localStorageObj = JSON.parse( <string>localStorage.getItem(this._localStorageName) );
    localStorageObj.forEach( (item: IMeeting) => {
      if ( obj.id === item.id ){
        item.end = obj.end;
        item.start = obj.start;
        item.title = obj.title;
      }
    } );
    localStorage.setItem( this._localStorageName, JSON.stringify(localStorageObj) );
  }

}
