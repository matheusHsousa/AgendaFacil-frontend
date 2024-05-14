import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  startLoader() {
    this.isLoading.next(true);
  }

  stopLoader(){
    this.isLoading.next(false);
  }
}
