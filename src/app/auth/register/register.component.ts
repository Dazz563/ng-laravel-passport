import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	isLogin = true;
	hidePassword = true;

	regForm: FormGroup;

	constructor(
		private authService: AuthService //
	) {}

	ngOnInit(): void {
		this.regForm = new FormGroup({
			name: new FormControl(''),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
		});
	}

	onChangeEntry() {
		this.isLogin = !this.isLogin;
	}

	onSubmitRegister() {
		this.authService.register(this.regForm.value);
	}
}
