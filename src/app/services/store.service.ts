import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  public selectedDate: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  constructor() {}
}
