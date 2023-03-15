import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {switchMap} from 'rxjs';
import {environment} from 'src/environments/environment';
import {UserModel} from '../services/auth.service';
import {ProductModel, ProductService} from '../services/product.service';
import {openProductDeleteModal, openProductModal} from './product-model/product-model.component';
import {openProdImagesModal} from './view-images-model/view-images-model.component';

@Component({
	selector: 'app-my-products',
	templateUrl: './my-products.component.html',
	styleUrls: ['./my-products.component.scss'],
})
export class MyProductsComponent implements OnInit {
	apiUrl = environment.apiUrl;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	displayedColumns: string[] = [
		'title', //
		'description', //
		'price',
		'created_at',
		// 'roles',
		'active',
		'actions',
	];
	dataSource = new MatTableDataSource<ProductModel>();
	constructor(
		private productService: ProductService, //
		private modal: MatDialog
	) {}

	ngOnInit(): void {
		// this.getproducts();
		this.productService.products$.subscribe((products) => {
			console.log(products);
			this.dataSource.data = products;
		});
		this.productService.getAllProducts();
	}

	getproducts() {
		// 	this.productService.getAllProducts().subscribe({
		// 		next: (res: any) => {
		// 			console.log(res);
		// 			res.data = res.data.map((user) => {
		// 				if (user.deleted_at) {
		// 					return {...user, active: false};
		// 				} else {
		// 					return {...user, active: true};
		// 				}
		// 			});
		// 			this.dataSource.data = res.data;
		// 			this.dataSource.paginator = this.paginator;
		// 		},
		// 		error: (error) => {
		// 			console.log(error);
		// 		},
		// 	});
	}

	createProduct(): void {
		openProductModal(this.modal, null, 'create').subscribe((product) => {
			if (product) {
				this.productService.createProduct(product).subscribe(() => {
					// do nothing, subscription to products will handle update of table
				});
			}
		});
	}

	// createProduct() {
	// 	openProductModal(this.modal, null, 'create').subscribe((product) => {
	// 		if (product) {
	// 			this.productService.createProduct(product).subscribe({
	// 				next: (res: any) => {
	// 					console.log(res);
	// 					this.getproducts();
	// 				},
	// 				error: (error) => {
	// 					console.log(error);
	// 				},
	// 			});
	// 		}
	// 	});
	// }

	editProduct(product: any) {
		// 	openProductModal(this.modal, product, 'update').subscribe((product) => {
		// 		if (product) {
		// 			this.productService.updateProduct(product).subscribe({
		// 				next: (res: any) => {
		// 					console.log(res);
		// 					this.getproducts();
		// 				},
		// 				error: (error) => {
		// 					console.log(error);
		// 				},
		// 			});
		// 		}
		// 	});
	}

	restoreProduct(_t60: any) {
		throw new Error('Method not implemented.');
	}

	deleteProduct(product: any) {
		// 	openProductDeleteModal(this.modal, product, 'delete').subscribe((value) => {
		// 		if (value) {
		// 			this.productService.deleteProduct(value).subscribe({
		// 				next: (res: any) => {
		// 					console.log(res);
		// 					this.getproducts();
		// 				},
		// 				error: (error) => {
		// 					console.log(error);
		// 				},
		// 			});
		// 		}
		// 	});
	}

	viewImages(product: any) {
		openProdImagesModal(this.modal, null, 'update').subscribe((value) => {
			if (value) {
			}
		});
	}
}
