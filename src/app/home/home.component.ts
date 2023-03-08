import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthService} from '../services/auth.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	URL = environment.apiUrl;
	clientsForm: FormGroup;

	constructor(
		public authService: AuthService, //
		private http: HttpClient
	) {}

	ngOnInit(): void {
		this.clientsForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			redirect: new FormControl('', Validators.required),
		});
	}

	logout() {
		this.authService.logout();
	}

	getUser() {
		this.http
			.get(`${this.URL}/api/user`)
			.pipe(map((res) => res['data']))
			.subscribe({
				next: (res: any) => {
					console.log(res);
				},
			});
	}
}
