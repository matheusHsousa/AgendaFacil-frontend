import { Data } from '@angular/router';

export interface CustomRoute extends Data {
  expectedRole?: string;
  allowedRoles?: string[];
}
