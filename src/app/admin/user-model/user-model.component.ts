import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
	selector: 'app-user-model',
	templateUrl: './user-model.component.html',
	styleUrls: ['./user-model.component.scss'],
})
export class UserModelComponent implements OnInit {
	deleteModal = false;
	actionType: string;

	userForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data, //
		private modalRef: MatDialogRef<UserModelComponent>
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

			this.userForm = new FormGroup({
				id: new FormControl('', [Validators.required]),
				name: new FormControl('', [Validators.required]),
				email: new FormControl('', [Validators.required, Validators.email]),
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
		this.modalRef.close(this.userForm.value);
	}

	onDelete() {
		this.modalRef.close(null);
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
