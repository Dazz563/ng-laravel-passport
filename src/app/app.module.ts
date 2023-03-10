import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HomeComponent} from './home/home.component';
import {SharedModule} from './shared/shared.module';
import {AuthInterceptorService} from './services/auth-interceptor.service';
import {SidenavListComponent} from './home/sidenav-list/sidenav-list.component';
import {ViewerComponent} from './viewer/viewer.component';
import {AdminComponent} from './admin/admin.component';
import {UserModelComponent} from './admin/user-model/user-model.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { ProductModelComponent } from './my-products/product-model/product-model.component';
import { ViewImagesModelComponent } from './my-products/view-images-model/view-images-model.component';

@NgModule({
	declarations: [
		AppComponent, //
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		HomeComponent,
		SidenavListComponent,
		ViewerComponent,
		AdminComponent,
		UserModelComponent,
  MyProductsComponent,
  ProductModelComponent,
  ViewImagesModelComponent,
	],
	imports: [
		BrowserModule, //
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		SharedModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptorService,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
