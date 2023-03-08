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

	// Send forgot password mail
	getAllUsers() {
		// await this.loading.show();
		this.http.get(`${this.URL}/api/get_all_users`).subscribe({
			next: (res: any) => {
				console.log(res.data);
			},
			error: (error) => {
				console.log(error);
			},
		});
	}
}
