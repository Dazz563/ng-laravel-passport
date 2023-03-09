import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	URL: string = environment.apiUrl;
	constructor(
		private http: HttpClient, //
		private snackbar: MatSnackBar // private loader: AppLoaderService
	) {}

	getAllUsers() {
		// await this.loading.show();
		return this.http.get(`${this.URL}/api/get_all_users`);
	}

	createUser(newUser: any) {
		// await this.loading.show();
		return this.http.post(`${this.URL}/api/create_user`, newUser).subscribe({
			next: (res: any) => {
				console.log(res);
			},
			error(error) {
				console.log(error);
			},
		});
	}

	updateUser(user: any) {
		// await this.loading.show();
		return this.http.post(`${this.URL}/api/edit_roles/${user.id}`, user).subscribe({
			next: (res: any) => {
				console.log(res);
			},
			error(error) {
				console.log(error);
			},
		});
	}
}
