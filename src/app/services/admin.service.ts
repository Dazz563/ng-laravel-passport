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
		return this.http.get(`${this.URL}/api/get_all_users`);
	}

	createUser(newUser: any) {
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
		return this.http.post(`${this.URL}/api/edit_roles/${user.id}`, user);
	}

	deleteUser(id: number) {
		return this.http.delete(`${this.URL}/api/delete_user/${id}`);
	}

	restoreUser(id: number) {
		return this.http.put(`${this.URL}/api/restore_user/${id}`, null);
	}
}
