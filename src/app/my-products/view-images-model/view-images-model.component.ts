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

	// deleteTemImg(imageData: any) {
	// 	// create a new array from the FileList using the spread operator
	// 	const filesArray = Array.from(this.files);

	// 	// filter out the image to be removed
	// 	const updatedFiles = filesArray.filter((file) => file.name !== imageData.name);

	// 	// create a new DataTransfer object and add the updated files
	// 	const dataTransfer = new DataTransfer();
	// 	updatedFiles.forEach((file) => dataTransfer.items.add(file));

	// 	// update the files selection
	// 	this.files = dataTransfer.files;
	// }

	deleteImg(imageData: any) {
		// update the DOM
		this.existingImages = this.existingImages.filter((i) => i.id != imageData.id);
		// send delete to the server
		this.productService.deleteProductImage(imageData.id).subscribe({
			next: (res) => {
				console.log(res);
			},
		});
	}

	onClose() {
		this.modalRef.close(null);
	}

	onSubmit() {
		console.log(this.files);
		this.modalRef.close(Array.from(this.files));
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
