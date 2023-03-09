import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Material
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
	declarations: [],
	imports: [
		CommonModule, //
		ReactiveFormsModule,
		FormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatSnackBarModule,
		MatSidenavModule,
		MatListModule,
		MatTableModule,
		MatMenuModule,
		MatPaginatorModule,
		MatDialogModule,
		MatCheckboxModule,
	],
	exports: [
		ReactiveFormsModule, //
		FormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatSnackBarModule,
		MatSidenavModule,
		MatListModule,
		MatTableModule,
		MatMenuModule,
		MatPaginatorModule,
		MatDialogModule,
		MatCheckboxModule,
	],
})
export class SharedModule {}
