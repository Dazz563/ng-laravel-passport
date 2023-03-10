import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {HelperService} from 'src/app/services/helper.service';
import {environment} from 'src/environments/environment';

@Component({
	selector: 'app-user-model',
	templateUrl: './user-model.component.html',
	styleUrls: ['./user-model.component.scss'],
})
export class UserModelComponent implements OnInit {
	apiUrl = environment.apiUrl;
	deleteModal = false;
	actionType: string;
	viewImage: string;
	updateImage: string = null;
	file: any;

	userForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data, //
		private modalRef: MatDialogRef<UserModelComponent>,
		private helper: HelperService
	) {}

	ngOnInit(): void {
		// used in the template
		this.actionType = this.data.action;
		if (this.data.action === 'create') {
			this.userForm = new FormGroup(
				{
					name: new FormControl('', [Validators.required]),
					email: new FormControl('', [Validators.required, Validators.email]),
					password: new FormControl('', [Validators.required]),
					admin: new FormControl(false),
					vendor: new FormControl(false),
					user: new FormControl(true),
				},
				[this.requireOneTrueValidator()]
			);
		} else if (this.data.action === 'update') {
			console.log(this.data);
			this.viewImage = this.apiUrl + this.data.avatar;

			this.userForm = new FormGroup({
				id: new FormControl('', [Validators.required]),
				name: new FormControl('', [Validators.required]),
				email: new FormControl('', [Validators.required, Validators.email]),
				avatar: new FormControl(''),
				admin: new FormControl(false),
				vendor: new FormControl(false),
				user: new FormControl(true),
			});

			this.userForm.patchValue(this.data);

			// Define the role names to check for
			const roleNames = ['admin', 'user', 'vendor'];

			// Loop through the roles in the response and patch the corresponding form control
			for (const role of this.data.roles) {
				const roleName = role.name;
				if (roleNames.includes(roleName)) {
					this.userForm.controls[roleName].patchValue(true);
				}
			}
		} else if (this.data.action === 'delete') {
			this.deleteModal = this.data.action;
		}
	}

	close() {
		this.modalRef.close();
	}

	submit() {
		/**
		 * Check if the image was updated & remove path laravel sent to display image
		 */
		if (!this.updateImage) {
			this.userForm.patchValue({
				'avatar': this.removeAvatarPath(this.userForm.value.avatar),
			});
			console.log(this.userForm.value);

			this.modalRef.close(this.userForm.value);
			return;
		}
		/**
		 * Or we submit image to api and use response to ref image
		 */
		this.helper.uploadImageWebCompress(['/api/upload_avatar', this.file]).subscribe({
			next: (res: any) => {
				if (res.data) {
					console.log(res);
					this.userForm.patchValue({
						'avatar': res.data,
					});
					// Save users
					console.log(this.userForm.value);
					this.modalRef.close(this.userForm.value);
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	updateAvatar($event: Event) {
		this.file = ($event.target as HTMLInputElement).files[0];
		const reader = new FileReader();
		reader.onload = () => {
			this.viewImage = null;
			this.updateImage = reader.result as string;
			// this.imageSelected = true; // update the property when an image is selected
		};
		reader.readAsDataURL(this.file);
	}

	removeAvatarPath(str) {
		return str.replace('/storage/avatars/', '');
	}

	onDelete() {
		this.modalRef.close(this.data);
	}

	requireOneTrueValidator(): ValidatorFn {
		return (group: FormGroup): ValidationErrors | null => {
			const admin = group.controls['admin'].value;
			const vendor = group.controls['vendor'].value;
			const user = group.controls['user'].value;

			if (!(admin || vendor || user)) {
				return {requireOneTrue: true};
			}

			return null;
		};
	}
}

export const openUserModal = (dialog: MatDialog, data = null, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(UserModelComponent, config);
	return modalRef.afterClosed();
};

export const openUserDeleteModal = (dialog: MatDialog, data: any, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(UserModelComponent, config);
	return modalRef.afterClosed();
};
