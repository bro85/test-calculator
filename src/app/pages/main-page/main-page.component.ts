import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  public selected: Date | undefined;
  private _selectedDateSubscription: Subscription;

  constructor(private _storeService: StoreService,
              private _meetingService: MeetingService) {}

  ngOnDestroy(): void {
    this._selectedDateSubscription.unsubscribe();
  }

  ngOnInit(): void {
     this._selectedDateSubscription = this._storeService.selectedDate.subscribe( val => {
       this.selected = val;
    } )
  }

  dateChanged(e: any) {
    this._storeService.selectedDate.next(e);
  }

}
