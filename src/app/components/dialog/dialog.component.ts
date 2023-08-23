import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMeeting } from '../../interfaces/meeting.interface';
import { MeetingService } from '../../services/meeting.service';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent implements OnInit, OnDestroy {

  public hours: string[] = [];
  public meetingDate: Date;
  public meetingStartHour: string;
  public meetingFinishHour: string;
  public selectedDate: Date;
  private selectedDateSubscription: Subscription;

  constructor(private _meetingService: MeetingService,
              private _storeService: StoreService,
              @Inject(MAT_DIALOG_DATA) public data: IMeeting) {}

  ngOnDestroy(): void {
    this.selectedDateSubscription.unsubscribe();
  }

  ngOnInit(): void {
    let startHour = new Date( this.data.start ).getHours();
    this.meetingDate = new Date( this.data.start );
    this.meetingStartHour = startHour.toString();

    if ( this.meetingStartHour.length === 1 ) {
      this.meetingStartHour = `0${this.meetingStartHour}`
    }

    for (let i = 0; i < 24; i++){
      let item = i.toString();
      item.length === 1 ? item = `0${item}` : ''
      this.hours.push(item);
    }

    this.calculateFinishHour();

    this.selectedDateSubscription = this._storeService.selectedDate.subscribe( val => {
      this.selectedDate = val;
    } );

  }

  calculateFinishHour(): void {
    let startHour = +this.meetingStartHour;
    let finishHour = 0;
    if ( startHour !== 23 ){
      finishHour = startHour + 1;
    }
    this.meetingFinishHour = finishHour.toString();
    if ( this.meetingFinishHour.length === 1 ) {
      this.meetingFinishHour = `0${this.meetingFinishHour}`
    }
  }

  startTimeChange() {
    this.calculateNewTime();
    this.calculateFinishHour();
  }

  calculateNewTime(): void {
    const newStartTime = this.meetingDate.getTime() + (+this.meetingStartHour*3600000);
    const newFinishTime = this.meetingDate.getTime() + ((+this.meetingStartHour + 1)*3600000);
    this.data.start = newStartTime;
    this.data.end = newFinishTime;
  }

  acceptClick() {
    let allMeetings = this._meetingService.getAllMeetings();
    let meeting;
    if (!!allMeetings){
      meeting = allMeetings.find( item => item.id === this.data.id );
    }
    // If meeting with such id is in LocalStorage then update it else add new meeting
    if (!!meeting){
      this._meetingService.updateMeeting(this.data);
    } else {
      this._meetingService.addLocalStorageMeeting(this.data);
    }
  }

  deleteMeeting() {
    this._meetingService.deleteMeeting(this.data);
  }

  meetingDateChange() {
    this.calculateNewTime();
  }
}
