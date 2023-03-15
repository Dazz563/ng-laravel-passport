import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
	selector: 'app-view-images-model',
	templateUrl: './view-images-model.component.html',
	styleUrls: ['./view-images-model.component.scss'],
})
export class ViewImagesModelComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
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
