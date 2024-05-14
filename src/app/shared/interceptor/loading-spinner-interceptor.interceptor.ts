import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';


@Injectable()
export class LoadingSpinnerInterceptor implements HttpInterceptor {
  
  totalRequests = 0;

  constructor(public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
      this.totalRequests++;
      this.loaderService.isLoading.next(true);

      return next.handle(request).pipe(
          finalize(() => {
              this.totalRequests--;
              if (this.totalRequests === 0) {
                  this.loaderService.isLoading.next(false);
              }
          })
      );
  }

}
