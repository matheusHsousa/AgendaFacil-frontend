import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CoursesService } from './courses/services/courses.service';
import { AuthService } from './shared/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from './customer/services/customer.service';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  authGuardPath: string = '';
  currentRouteName: string = '';
  user: any;
  jsonString: any;
  getId: any;
  urlImage: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coursesService: CoursesService,
    private authService: AuthService,
    private customerService: CustomerService,
    public loaderService: LoaderService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.authGuardPath = event.url;
        this.updateCurrentRouteName();
      }
    });

    this.authService.userUpdated$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((userData) => {
        this.user = userData;
      });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.coursesService.isAuthenticated = true;
    }
    this.user = this.getUserData();

    this.jsonString = localStorage.getItem('userId');
    this.getId = JSON.parse(this.jsonString);

    this.customerService.getProfilePicture(this.getId.id).subscribe((data) => {
      this.urlImage = data;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get isAuthenticated(): boolean {
    return this.coursesService.isAuthenticated;
  }

  private updateCurrentRouteName(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.currentRouteName = route.snapshot.data['name'] || '';
  }

  isLoginPage(): boolean {
    return this.authGuardPath === '/login';
  }

  logout(): void {
    this.coursesService.isAuthenticated = false;
    this.authService.setAuthenticated(false);
    this.authService.clearUserCredentials();
    this.authService.clearUserId();

    this.router.navigate(['/login']);
  }

  isRoleAllowed(...expectedRoles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return expectedRoles.includes(userRole);
  }

  shouldShowIcon(expectedRoles: string[]): boolean {
    return this.isRoleAllowed(...expectedRoles);
  }

  getUserData() {
    const userData = localStorage.getItem('userId');
    const UserData = localStorage.getItem('userId');

    if (UserData !== null) {
      return JSON.parse(UserData);
    } else {
      console.error('Dados do usuário não encontrados no localStorage.');
      return null;
    }
  }

  
}
