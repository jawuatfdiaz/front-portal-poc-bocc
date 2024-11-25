import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataSideBar = new BehaviorSubject<any>(null);
  dataFromHeader$ = this.dataSideBar.asObservable();

  sendDataSideBar(data: any) {
    this.dataSideBar.next(data);
  }

  private dataFilter = new BehaviorSubject<any>(null);
  dataFromFilter$ = this.dataFilter.asObservable();

  sendDataCatalog(data: any) {
    this.dataFilter.next(data);
  }
}
