import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {HelperService} from 'src/app/services/helper.service';

@Component({
	selector: 'app-view-images-model',
	templateUrl: './view-images-model.component.html',
	styleUrls: ['./view-images-model.component.scss'],
})
export class ViewImagesModelComponent implements OnInit {
	images: string[] = [];
	imagesSelected = false;
	files: FileList;

	constructor(
		private helper: HelperService //
	) {}

	ngOnInit(): void {}

	onSubmit() {
		console.log(this.files);

		// Submit image to api and use response to ref image
		this.helper.uploadMultipleImageWebCompress(['/api/upload_product_images', Array.from(this.files)]).subscribe({
			next: (res: any) => {
				if (res.data) {
					console.log(res);
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
		// this.helper.uploadMultipleImageWebCompress(['/api/upload_product_images', this.files]).then((res) => {
		// 	console.log('hopefully a good res: ', res);
		// });
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
