import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HelperService} from 'src/app/services/helper.service';
import {ProductService} from 'src/app/services/product.service';
import {environment} from 'src/environments/environment';

@Component({
	selector: 'app-view-images-model',
	templateUrl: './view-images-model.component.html',
	styleUrls: ['./view-images-model.component.scss'],
})
export class ViewImagesModelComponent implements OnInit {
	apiUrl = environment.apiUrl;
	existingImages = [];

	images: string[] = [];
	imagesSelected = false;
	files: FileList;

	constructor(
		private helper: HelperService, //
		@Inject(MAT_DIALOG_DATA) public data, //
		private modalRef: MatDialogRef<ViewImagesModelComponent>,
		private productService: ProductService
	) {}

	ngOnInit(): void {
		console.log(this.data);
		this.existingImages = this.data.product_images.map((i) => {
			return {
				id: i.id,
				image: this.apiUrl + i.image,
			};
		});
	}

	deleteImg(imageData: any) {
		// update the DOM
		this.existingImages = this.existingImages.filter((i) => i.id != imageData.id);
		// send delete to the server
		// let imageToDelete = this.helper.removeUrlPath(imageData.image);
		// console.log(imageToDelete);
		this.productService.deleteProductImage(imageData.id).subscribe({
			next: (res) => {
				console.log(res);
			},
		});
	}

	onSubmit() {
		console.log(this.files);

		// Submit image to api and use response to ref image
		this.helper.uploadMultipleImageWebCompress([`/api/upload_product_images/${this.data.id}`, Array.from(this.files)]).subscribe({
			next: (res: any) => {
				if (res.data) {
					console.log(res);
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	addProductImages(event: Event) {
		this.files = (event.target as HTMLInputElement).files;
		const readers = [];
		// let newfiles = Array(this.files)

		for (let i = 0; i < this.files.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				this.images.push(reader.result as string);
				this.imagesSelected = true; // update the property when an image is selected
			};
			reader.readAsDataURL(this.files[i]);
			readers.push(reader);
		}
	}
}

export const openProdImagesModal = (dialog: MatDialog, data = null, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(ViewImagesModelComponent, config);
	return modalRef.afterClosed();
};
