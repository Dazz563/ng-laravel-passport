import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, map, tap} from 'rxjs';
import {environment} from 'src/environments/environment';

export interface UserModel {
	name: string;
	email: string;
	password: string;
}
export interface ResetDataModel {
	password: string;
	token: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	URL: string = environment.apiUrl;
	// User state
	private subject = new BehaviorSubject<string>('');
	accessToken$: Observable<string> = this.subject.asObservable();

	isLoggedIn$: Observable<boolean>;
	isLoggedOut$: Observable<boolean>;

	constructor(
		private http: HttpClient, //
		private router: Router,
		private snackbar: MatSnackBar // private loader: AppLoaderService
	) {
		this.isLoggedIn$ = this.accessToken$.pipe(map((token) => !!token));
		this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

		// checking auth status from local storage
		const token = localStorage.getItem('auth_token');

		if (token && token != 'undefined') {
			this.subject.next(token);
		}
	}

	// Register
	register(newUser: UserModel) {
		// this.loader.loadingOn();
		this.http
			.post(`${this.URL}/api/register`, newUser)
			.pipe(
				tap((res: any) => {
					const token = res.token;
					this.subject.next(token);
					const user = res['data'];
					localStorage.setItem('auth_token', token);
					localStorage.setItem('user_details', JSON.stringify(user)); // Convert to JSON string before storing
					// Navigate to login after token expiration
					setTimeout(() => {
						this.router.navigateByUrl('/');
						localStorage.removeItem('auth_token');
					}, 1000 * 60 * 60);
				})
			)
			.subscribe({
				next: (res: any) => {
					console.log(res);
					if (res) {
						// Handle success notification
						// this.loader.loadingOff();
						this.snackbar.open('Success', 'Registered successfully', {duration: 4000});
						this.router.navigateByUrl('/menu');
					}
				},
				error: (error) => {
					// Handle error
					console.log(error);
					this.snackbar.open('Error', 'Somthing went wrong', {duration: 4000});
				},
			});
	}

	// Login
	login(user: UserModel) {
		// this.loader.loadingOn();
		this.http
			.post<string>(`${this.URL}/api/login`, user)
			.pipe(
				tap((res: any) => {
					const token = res.token;
					this.subject.next(token);
					const user = res['data'];
					localStorage.setItem('auth_token', token);
					localStorage.setItem('user_details', JSON.stringify(user)); // Convert to JSON string before storing
					setTimeout(() => {
						this.router.navigateByUrl('/');
						localStorage.removeItem('auth_token');
					}, 1000 * 60 * 60);
				})
			)
			.subscribe({
				next: (res: string) => {
					if (res) {
						console.log('token res: ', res);

						// Loader
						// this.loader.loadingOff();
						// Handle success notification
						this.snackbar.open('Success', 'Welcome back!', {duration: 4000});
						// Route user
						this.router.navigateByUrl('/menu');
					}
				},
				error: (error) => {
					// Handle error
					console.log(error);
					// Loader
					// this.loader.loadingOff();
					// Handle success notification
					this.snackbar.open('Oops', 'Something went wrong!', {duration: 4000});
				},
			});
	}

	// Send forgot password mail
	forgotPassword(email: string) {
		// await this.loading.show();
		this.http.post(`${this.URL}/api/forgot_password`, email).subscribe({
			next: (res: any) => {
				console.log(res);
				if (res.data) {
					this.snackbar.open(`Reset password sent to ${email['email']}`, null, {
						duration: 4000,
						horizontalPosition: 'center',
						verticalPosition: 'top',
					});
					this.router.navigateByUrl('/login');
				}
			},
			error: (error) => {
				console.log(error);
				if (error.error.error) {
					this.snackbar.open(`${error.error.error}`, '', {
						duration: 4000,
						horizontalPosition: 'center',
						verticalPosition: 'top',
					});
				}
			},
		});
	}

	// Reset password
	resetPassword(resetData: ResetDataModel) {
		console.log(resetData);

		this.http.post(`${this.URL}/api/reset_password_with_token`, resetData).subscribe({
			next: (res: any) => {
				console.log(res);
				if (res.data) {
					this.snackbar.open(`Password reset successfully`, null, {
						duration: 4000,
						horizontalPosition: 'center',
						verticalPosition: 'top',
					});
					this.router.navigateByUrl('/login');
				}
			},
			error: (error) => {
				console.log(error);
				if (error.error.error) {
					this.snackbar.open(`${error.error.error}`, '', {
						duration: 4000,
						horizontalPosition: 'center',
						verticalPosition: 'top',
					});
				}
			},
		});
	}

	logout() {
		// Loader
		// this.loader.loadingOn();
		localStorage.removeItem('user_details');
		localStorage.removeItem('auth_token');
		this.subject.next(null);
		this.router.navigateByUrl('/');
		// Loader
		// this.loader.loadingOff();
	}
}
