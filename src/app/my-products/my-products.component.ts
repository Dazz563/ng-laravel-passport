import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {HelperService} from '../services/helper.service';
import {ProductModel, ProductService} from '../services/product.service';
import {openProductDeleteModal, openProductModal} from './product-model/product-model.component';
import {openProdImagesModal} from './view-images-model/view-images-model.component';

@Component({
	selector: 'app-my-products',
	templateUrl: './my-products.component.html',
	styleUrls: ['./my-products.component.scss'],
})
export class MyProductsComponent implements OnInit, OnDestroy {
	apiUrl = environment.apiUrl;
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	displayedColumns: string[] = [
		'title', //
		'description',
		'price',
		'created_at',
		'active',
		'actions',
	];
	private productsSubscription: Subscription;
	dataSource = new MatTableDataSource<ProductModel>();
	constructor(
		private productService: ProductService, //
		private modal: MatDialog,
		private helper: HelperService
	) {}

	ngOnInit(): void {
		this.productsSubscription = this.productService.products$.subscribe((products) => {
			console.log(products);
			this.dataSource.data = products;
		});
		this.productService.getAllProducts();
	}

	createProduct(): void {
		openProductModal(this.modal, null, 'create').subscribe((product) => {
			if (product) {
				this.productService.createProduct(product).subscribe();
			}
		});
	}

	editProduct(product: any) {
		openProductModal(this.modal, product, 'update').subscribe((product) => {
			if (product) {
				this.productService.updateProduct(product).subscribe();
			}
		});
	}

	restoreProduct(product: any) {
		openProductDeleteModal(this.modal, product, 'restore').subscribe((value) => {
			if (value) {
				this.productService.restoreProduct(value).subscribe();
			}
		});
	}

	deleteProduct(product: any) {
		openProductDeleteModal(this.modal, product, 'delete').subscribe((value) => {
			if (value) {
				this.productService.deleteProduct(value).subscribe();
			}
		});
	}

	viewImages(product: any) {
		openProdImagesModal(this.modal, product, 'update').subscribe((imageFiles) => {
			if (imageFiles) {
				this.productService.uploadProductImages(product.id, imageFiles).subscribe();
			}
		});
	}

	ngOnDestroy(): void {
		this.productsSubscription.unsubscribe();
	}
}
