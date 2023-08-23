import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MeetingService } from '../../services/meeting.service';
import { IMeeting } from '../../interfaces/meeting.interface';
import { IHours } from '../../interfaces/hours.interface';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss']
})
export class HoursComponent implements OnInit, OnDestroy {

  // public hours: string[] = [];
  public hours: IHours[] = [];
  public dailyMeetings: IMeeting[] = [];
  private _selectedDate: Date;
  private _selectedDateSubscription: Subscription;

  constructor(private _dialog: MatDialog,
              private _meetingService: MeetingService,
              private _storeService:StoreService) {}

  createHours(): void {

    for (let i = 0; i < 24; i++){
      let curMeeting = this.dailyMeetings.find( (item, index) => index === i );
      if (!curMeeting){
        curMeeting = {
          end: 0,
          id: '',
          start: 0,
          title: ''
        }
      }
      let item = i.toString();
      item.length === 1 ? item = `0${item}` : '';
      this.hours.push({
        hour: item,
        meeting: {...curMeeting}
      });
    }

  }

  ngOnDestroy(): void {
    this._selectedDateSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscribeToSelectedDate();
  }

  createDailyMeetings(): void {
    const allMeetings = this._meetingService.getAllMeetings();
    const startDate = this._selectedDate.setHours(0,0,0,0);
    const finishDate = this._selectedDate.setHours(0,0,0,0) + 86400000;
    if (!!allMeetings){
      allMeetings.forEach( item => {
        // If item.start match with selected date
        if (item.start >= startDate && item.start <= finishDate){
          const startHour = new Date( item.start ).getHours();
          this.dailyMeetings[startHour] = item;
        }
      } );
    }
  }

  subscribeToSelectedDate(): void {
    this._selectedDateSubscription = this._storeService.selectedDate.subscribe( val => {
      this.dailyMeetings = [];
      this.hours = [];
      this._selectedDate = val;
      this.createDailyMeetings();
      this.createHours();
    } );
  }

  hourClick(e: number): void {

    // Define start of selected hour
    const startTime = this._selectedDate.setHours(0,0,0,0) + e*60*60*1000;
    const allMeetings = this._meetingService.getAllMeetings();
    const dialogData: IMeeting = {
      end: 0,
      id: ( new Date().getTime() ).toString(),
      start: 0,
      title: ''
    };

    // Find object in array of meeting which include selected time
    let meeting;
    if (!!allMeetings){
      meeting = allMeetings.find( item => startTime >= item.start && startTime <= item.end );
    }

    if (!!meeting){
      dialogData.end = meeting.end;
      dialogData.id = meeting.id;
      dialogData.start = meeting.start;
      dialogData.title = meeting.title;
    } else {
      dialogData.end = startTime + 60*60*1000;
      dialogData.start = startTime;
    }

    const dialogRef = this._dialog.open(DialogComponent, {
      data: {...dialogData},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dailyMeetings = [];
      this.hours = [];
      this.createDailyMeetings();
      this.createHours();
    });
  }

}
