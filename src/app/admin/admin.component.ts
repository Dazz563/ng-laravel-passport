import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {AdminService} from '../services/admin.service';
import {UserModel} from '../services/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {openUserDeleteModal, openUserModal} from './user-model/user-model.component';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	displayedColumns: string[] = [
		'profile', //
		'name', //
		'email',
		'created_at',
		'roles',
		'active',
		'actions',
	];
	dataSource = new MatTableDataSource<UserModel>();
	constructor(
		private adminService: AdminService, //
		private modal: MatDialog
	) {}

	ngOnInit(): void {
		this.getUsers();
	}

	getUsers() {
		this.adminService.getAllUsers().subscribe({
			next: (res: any) => {
				console.log(res.data);

				// Map over the users array and set the `active` property
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

	createUser() {
		openUserModal(this.modal, null, 'create').subscribe((value) => {
			if (value) {
				if (value) {
					this.adminService.createUser(value);
					this.getUsers();
				}
			}
		});
	}

	editUser(user: any) {
		openUserModal(this.modal, user, 'update').subscribe((value) => {
			if (value) {
				this.adminService.updateUser(value);
				this.getUsers();
			}
		});
	}

	deleteUser(user: any) {
		openUserDeleteModal(this.modal, user, 'delete').subscribe((value) => {
			if (value) {
				console.log('company sending api: ', value);
			}
		});
	}

	isLast(index: number, array: any[]): boolean {
		return index === array.length - 1;
	}
}
