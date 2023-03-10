import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';
import {HelperService} from 'src/app/services/helper.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	isLogin = true;
	hidePassword = true;

	file: any;
	imageSelected = false;
	viewImage: any;

	regForm: FormGroup;

	constructor(
		private authService: AuthService, //
		private helper: HelperService
	) {}

	ngOnInit(): void {
		this.regForm = new FormGroup({
			name: new FormControl(''),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
			avatar: new FormControl(''),
		});
	}

	onChangeEntry() {
		this.isLogin = !this.isLogin;
	}

	onSubmitRegister() {
		console.log(this.file);

		// Submit image to api and use response to ref image
		this.helper.uploadImageWebCompress(['/api/upload_avatar', this.file]).subscribe({
			next: (res: any) => {
				if (res.data) {
					console.log(res);
					this.regForm.patchValue({
						'avatar': res.data,
					});
					// Save users
					console.log(this.regForm.value);
					this.authService.register(this.regForm.value);
				}
			},
			error: (error) => {
				console.log(error);
			},
		});
	}

	addAvatar(event: Event) {
		this.file = (event.target as HTMLInputElement).files[0];
		const reader = new FileReader();
		reader.onload = () => {
			this.viewImage = reader.result as string;
			this.imageSelected = true; // update the property when an image is selected
		};
		reader.readAsDataURL(this.file);
	}
}
