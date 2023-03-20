import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject, catchError, concatMap, map, Observable, of, switchMap, tap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {HelperService} from './helper.service';

export interface ProductModel {
	id: number;
	title: string;
	description: string;
	price: number;
	user_id: number;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
	product_images?: ImageModel[];
}
export interface ImageModel {
	id: number;
	created_at: Date;
	updated_at: Date;
	image: string;
	product_id: number;
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
		private snackbar: MatSnackBar,
		private helper: HelperService
	) {}

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

	createProduct(product: ProductModel): Observable<ProductModel> {
		return this.http.post<[{message: string; data: ProductModel}]>(`${this.URL}/api/products`, product).pipe(
			map((res) => {
				this.snackbar.open(res['message'], null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				let newProduct = res['data'];
				return {
					...newProduct,
					active: !product.deleted_at,
				};
			}),
			tap((createdProduct: ProductModel) => {
				const products = [createdProduct, ...this.productsSubject.value];
				this.productsSubject.next(products);
			}),
			catchError((error) => {
				console.log(error);

				this.snackbar.open(error.message, null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				return of(null);
			})
		);
	}

	updateProduct(product: ProductModel): Observable<ProductModel> {
		return this.http.patch<[{message: string; data: ProductModel}]>(`${this.URL}/api/products/${product.id}`, product).pipe(
			map((res) => {
				this.snackbar.open(res['message'], null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				let updatedProduct = res['data'];
				return {
					...updatedProduct,
					active: !product.deleted_at,
				};
			}),
			tap((updatedProduct: ProductModel) => {
				const products = this.productsSubject.value.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
				this.productsSubject.next(products);
			}),
			catchError((error) => {
				this.snackbar.open(error.message, 'Dismiss', {duration: 3000});
				return of(null);
			})
		);
	}

	deleteProduct(product: ProductModel): Observable<ProductModel> {
		return this.http.delete<[{message: string; data: ProductModel}]>(`${this.URL}/api/products/${product.id}`).pipe(
			map((res) => {
				this.snackbar.open(res['message'], null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				let deletedProduct = res['data'];

				return {
					...deletedProduct,
					active: product.deleted_at,
				};
			}),
			tap((deletedProduct: ProductModel) => {
				const products = this.productsSubject.value.map((p) => (p.id === deletedProduct.id ? deletedProduct : p));
				this.productsSubject.next(products);
			}),
			catchError((error) => {
				this.snackbar.open(error.message, 'Dismiss', {});
				return of(null);
			})
		);
	}

	restoreProduct(product: ProductModel): Observable<ProductModel> {
		return this.http.put<[{message: string; data: ProductModel}]>(`${this.URL}/api/restore_product/${product.id}`, product).pipe(
			map((res) => {
				this.snackbar.open(res['message'], null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				let restoredProduct = res['data'];

				return {
					...restoredProduct,
					active: !product.deleted_at,
				};
			}),
			tap((deletedProduct: ProductModel) => {
				const products = this.productsSubject.value.map((p) => (p.id === deletedProduct.id ? deletedProduct : p));
				this.productsSubject.next(products);
			}),
			catchError((error) => {
				this.snackbar.open(error.message, 'Dismiss', {});
				return of(null);
			})
		);
	}

	uploadProductImages(prodId: number, imageFiles): Observable<ImageModel[]> {
		// Submit image to api and use response to ref image
		return this.helper.uploadMultipleImageWebCompress([`/api/upload_product_images/${prodId}`, imageFiles]).pipe(
			map((res) => {
				this.snackbar.open(res['message'], null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				return res['data'];
			}),
			tap((imageRes: ImageModel[]) => {
				const products = this.productsSubject.value.map((p: ProductModel) => {
					if (p.id === prodId) {
						return {...p, product_images: imageRes}; // update the product's imageRes property with the returned imageRes
					} else {
						return p;
					}
				});
				this.productsSubject.next(products);
			}),
			catchError((error) => {
				this.snackbar.open(error.message, 'Dismiss', {duration: 3000});
				return of(null);
			})
		);
	}

	deleteProductImage(productImageId: number) {
		return this.http.delete(`${this.URL}/api/delete_product_image/${productImageId}`).pipe(
			concatMap(() => {
				// Update the productsSubject to remove the deleted image from the product
				const products = this.productsSubject.value.map((p: ProductModel) => {
					const updatedImages = p.product_images.filter((img) => img.id !== productImageId);
					return {...p, product_images: updatedImages};
				});
				this.productsSubject.next(products);
				this.snackbar.open('Image successfully deleted', null, {
					duration: 4000,
					horizontalPosition: 'center',
					verticalPosition: 'top',
				});
				return of(true);
			}),
			catchError((error) => {
				this.snackbar.open(error.message, 'Dismiss', {duration: 3000});
				return of(null);
			})
		);
	}
}
