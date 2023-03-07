import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './user/user.component';
import {ViewerComponent} from './viewer/viewer.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent,
	},
	{
		path: 'reset-password/:token',
		component: ResetPasswordComponent,
	},
	{
		path: 'menu',
		component: HomeComponent,
		// canActivate: [AuthGuard],
		children: [
			{
				path: 'viewer',
				component: ViewerComponent,
			},
			{
				path: 'user',
				component: UserComponent,
			},
			{
				path: 'admin',
				component: AdminComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
