import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private validEmail: string = '';
  private validPassword: string = '';
  private userId: any = '';

  private userEmail: string | undefined;
  private userPassword: string | undefined;

  private readonly STORAGE_KEY = 'userCredentials';
  private readonly AUTH_STORAGE_KEY = 'authenticatedUser';
  private userRole: string = '';
  private userUpdatedSubject = new Subject<any>();
  userUpdated$ = this.userUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.loadStoredCredentials();
  }


  isAuthenticated(): boolean {
    const storedUser = localStorage.getItem(this.AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : false;
  }

  setAuthenticated(status: boolean): void {
    localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(status));
  }

  setUserIdAndName(id: String, customer: String, name: String) {
    console.log('Método setUserIdAndName chamado com:', id, customer, name);
    const userData = { id, name, customer };
    console.log(userData)
    localStorage.setItem('userId', JSON.stringify(userData));
    this.userUpdatedSubject.next(userData);
  }

  authenticateUser(login: string, password: string): Observable<any> {
    const url = `http://localhost:8800/getUserByLoginAndPassword`;
    const body = { login, password };
  
    return this.http.post(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.openSnackBar('Credenciais inválidas. Por favor, verifique seu nome de usuário e senha.', 'Fechar');
          return throwError('Credenciais inválidas. Por favor, verifique seu nome de usuário e senha.');
        } else {
          console.error('Erro na solicitação:', error);
          this.openSnackBar('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', 'Fechar');
          return throwError('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
        }
      }),
      map((response: any) => {
        this.setAuthenticated(true);
        this.setUserRole(response.role); 
        return response;
    })
    );
  }
  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  
  getUserRole(): string {
    const storedUser = localStorage.getItem(this.AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser).role : '';
  }

  setUserRole(role: string): void {
    this.userRole = role;
    localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify({ role }));
  }

  setValidCredentials(email: string, password: string) {
    this.validEmail = email;
    this.validPassword = password;
  }

  getValidCredentials() {
    return { email: this.validEmail, password: this.validPassword };
  }

  setUserCredentials(email: string, password: string) {
    this.userEmail = email;
    this.userPassword = password;
    this.saveCredentialsToStorage();
  }

  getUserCredentials() {
    return { email: this.userEmail, password: this.userPassword };
  }

  private saveCredentialsToStorage() {
    const credentials = { email: this.userEmail, password: this.userPassword };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
  }

  private loadStoredCredentials() {
    const storedCredentials = localStorage.getItem(this.STORAGE_KEY);
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials);
      this.userEmail = credentials.email;
      this.userPassword = credentials.password;
    }
  }

  clearUserId() {
    this.userId = undefined;

    localStorage.removeItem('userId');
  }

  clearUserCredentials() {
    this.userEmail = undefined;
    this.userPassword = undefined;

    localStorage.removeItem('userCredentials');
  }
}
