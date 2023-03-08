import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from 'src/app/services/auth.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
	form: FormGroup;
	token: string;

	constructor(
		private authService: AuthService, //
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.route.paramMap.subscribe((params) => {
			this.token = params.get('token');
		});
		this.form = new FormGroup({
			password: new FormControl('', [Validators.required]),
		});
	}

	onSubmit() {
		const resetData = {
			password: this.form.value.password,
			token: this.token,
		};
		this.authService.resetPassword(resetData);
	}
}
