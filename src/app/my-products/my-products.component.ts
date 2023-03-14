import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from 'src/environments/environment';
import {UserModel} from '../services/auth.service';
import {ProductModel, ProductService} from '../services/product.service';

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
		private productService: ProductService //
	) {}

	ngOnInit(): void {
		this.getproducts();
	}

	getproducts() {
		this.productService.getAllProducts().subscribe({
			next: (res: any) => {
				console.log(res);

				res.data = res.data.map((user) => {
					if (user.deleted_at) {
						return {...user, active: false};
					} else {
						return {...user, active: true};
					}
				});
				this.dataSource.data = res.data;
				this.dataSource.paginator = this.paginator;
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	createProduct() {
		throw new Error('Method not implemented.');
	}
	restoreProduct(_t60: any) {
		throw new Error('Method not implemented.');
	}
	deleteProduct(_t60: any) {
		throw new Error('Method not implemented.');
	}
	editProduct(_t60: any) {
		throw new Error('Method not implemented.');
	}
	viewImages(_t71: any) {
		throw new Error('Method not implemented.');
	}
}
