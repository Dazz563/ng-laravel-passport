import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {environment} from 'src/environments/environment';

export interface ProductModel {
	id: number;
	title: string;
	description: string;
	price: number;
	user_id: number;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private readonly URL: string = environment.apiUrl;

	private productsSubject = new BehaviorSubject<ProductModel[]>([]);
	products$ = this.productsSubject.asObservable();

	constructor(
		private http: HttpClient, //
		private snackbar: MatSnackBar // private loader: AppLoaderService
	) {}

	// getAllProducts() {
	// 	return this.http.get(`${this.URL}/api/products`);
	// }
	getAllProducts() {
		this.http.get<{data: ProductModel[]}>(`${this.URL}/api/products`).subscribe((res) => {
			const products = res.data.map((product) => {
				return {
					...product,
					active: !product.deleted_at,
				};
			});
			this.productsSubject.next(products);
		});
	}

	// createProduct(product: ProductModel) {
	// 	return this.http.post(`${this.URL}/api/products`, product);
	// }

	createProduct(product: ProductModel): Observable<ProductModel> {
		return this.http.post<[{message: string; data: ProductModel}]>(`${this.URL}/api/products`, product).pipe(
			map((res) => res['data']),
			tap((createdProduct) => {
				const products = this.productsSubject.value.concat(createdProduct);
				this.productsSubject.next(products);
			})
		);
	}

	updateProduct(product: ProductModel) {
		return this.http.patch(`${this.URL}/api/products/${product.id}`, product);
	}

	deleteProduct(product: ProductModel) {
		return this.http.delete(`${this.URL}/api/products/${product.id}`);
	}
}
