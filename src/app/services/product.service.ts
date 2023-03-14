import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from 'src/environments/environment';

export interface ProductModel {
	id?: number;
	title: string;
	description: string;
	price: number;
	user_id: string;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
}

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	URL: string = environment.apiUrl;
	constructor(
		private http: HttpClient, //
		private snackbar: MatSnackBar // private loader: AppLoaderService
	) {}

	getAllProducts() {
		return this.http.get(`${this.URL}/api/products`);
	}
}
