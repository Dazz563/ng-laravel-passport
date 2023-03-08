import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
	form: FormGroup;

	constructor(
		private authService: AuthService //
	) {}

	ngOnInit(): void {
		this.form = new FormGroup({
			email: new FormControl('', [Validators.required, Validators.email]),
		});
	}

	onSubmit() {
		this.authService.forgotPassword(this.form.value);
	}
}
