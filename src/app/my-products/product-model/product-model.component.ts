import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ProductModel} from 'src/app/services/product.service';

@Component({
	selector: 'app-product-model',
	templateUrl: './product-model.component.html',
	styleUrls: ['./product-model.component.scss'],
})
export class ProductModelComponent implements OnInit {
	deleteModal = false;
	restoreModal = false;
	actionType: string;

	productForm = new FormGroup({
		id: new FormControl(null),
		user_id: new FormControl(null),
		title: new FormControl(null, [Validators.required]),
		description: new FormControl(null),
		price: new FormControl(null, [Validators.required]),
	});
	constructor(
		@Inject(MAT_DIALOG_DATA) public data, //
		private modalRef: MatDialogRef<ProductModelComponent>
	) {}

	ngOnInit(): void {
		this.actionType = this.data.action;

		switch (this.data.action) {
			case 'create':
				// this.userForm = this.userFormService.createForm();
				break;

			case 'update':
				this.productForm.patchValue(this.data);
				console.log('product to after patch', this.productForm.value);

				break;

			case 'delete':
				this.deleteModal = this.data.action;
				break;
			case 'restore':
				this.restoreModal = this.data.action;
				break;

			default:
				// handle invalid action
				break;
		}
	}

	submit() {
		let product = this.productForm.value as ProductModel;
		// console.log(product);
		this.modalRef.close(product);
	}

	close() {
		this.modalRef.close();
	}

	onDelete() {
		this.modalRef.close(this.data);
	}

	onRestore() {
		this.modalRef.close(this.data);
	}
}

export const openProductModal = (dialog: MatDialog, data = null, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(ProductModelComponent, config);
	return modalRef.afterClosed();
};

export const openProductDeleteModal = (dialog: MatDialog, data: any, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(ProductModelComponent, config);
	return modalRef.afterClosed();
};
