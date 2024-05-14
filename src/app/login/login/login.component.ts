import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/courses/services/courses.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private coursesService: CoursesService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  isAuthenticated(): boolean {
    const userCredentials = this.authService.getUserCredentials();
    const validCredentials = this.authService.getValidCredentials();

    return (
      userCredentials.email === validCredentials.email &&
      userCredentials.password === validCredentials.password
    );
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const login = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.authenticateUser(login, password).subscribe(
        (response) => {
          this.authService.setUserCredentials(login, password);
          this.authService.setAuthenticated(true);
          this.authService.setUserRole(response.role);
          this.coursesService.isAuthenticated = true;
          this.authService.setUserIdAndName(
            response.id,
            response.customer,
            response.name
          );

          this.router.navigate(['/courses']);
        },
      );
    }
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
