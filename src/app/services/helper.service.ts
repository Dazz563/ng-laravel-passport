import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import imageCompression from 'browser-image-compression';
import {of, switchMap, map, catchError, finalize, Observable, forkJoin, from, firstValueFrom} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class HelperService {
	compressionOptions = {
		maxSizeMB: 1,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
	};

	constructor(
		private http: HttpClient //
	) {}

	uploadImageWebCompress(args): Observable<any> {
		console.log('DOING COMPRESSED UPLOAD');
		// TODO: Show loading spinner or progress bar

		// Convert the imageFile to an Observable using the of() operator
		return of(args[1]).pipe(
			// Switch to the imageCompression() Observable to compress the image
			switchMap((file) => {
				// Compress the image using the imageCompression library
				return imageCompression(file, this.compressionOptions);
			}),
			// Map the compressed image to a FormData object
			map((compressedFile) => {
				// Create a new FormData object
				let formData = new FormData();

				// Set the file extension based on the image type
				let ext = '.jpeg';
				if (compressedFile.type.includes('png')) {
					ext = '.png';
				}

				// Append the compressed image to the FormData object
				formData.append('file', compressedFile, compressedFile.name + ext);

				// Return the FormData object
				return formData;
			}),
			// Send the FormData object to the server using the HttpClient
			switchMap((formData) => this.http.post(environment.apiUrl + args[0], formData)),
			// Catch any errors that occur during the operation
			catchError((error) => {
				// Check if the error is due to an invalid image file
				if (error?.message.includes('given is not an i')) {
					// Set a custom error message
					error.message = 'The given file was not an image, please upload a JPG or PNG.';
				}
				// Re-throw the error
				throw error;
			}),
			// TODO: Hide loading spinner or progress bar
			finalize(() => {
				// TODO: Hide loading spinner or progress bar
			})
		);
	}

	uploadMultipleImageWebCompress(args): Observable<any> {
		console.log('DOING COMPRESSED UPLOAD');
		// Create an array of observables for each file using the from() operator
		const fileObservables = args[1].map((file) => {
			// Compress the image using the imageCompression library and return the compressed file
			return from(imageCompression(file, this.compressionOptions));
		});

		// Use the forkJoin() operator to wait for all files to be compressed
		return forkJoin(fileObservables).pipe(
			// Map the compressed files to an array of FormData objects
			map((compressedFiles: any) => {
				// Create a new FormData object
				let formData = new FormData();

				// Loop through the compressed files and append them to the FormData object
				compressedFiles.forEach((compressedFile) => {
					// Set the file extension based on the image type
					let ext = '.jpeg';
					if (compressedFile.type.includes('png')) {
						ext = '.png';
					}

					// Append the compressed image to the FormData object with a unique name
					formData.append('files[]', compressedFile, compressedFile.name + ext);
				});

				// Return the FormData object
				return formData;
			}),
			// Send the FormData object to the server using the HttpClient
			switchMap((formData) => this.http.post(environment.apiUrl + args[0], formData)),
			// Catch any errors that occur during the operation
			catchError((error) => {
				// Check if the error is due to an invalid image file
				if (error?.message.includes('given is not an i')) {
					// Set a custom error message
					error.message = 'The given file was not an image, please upload a JPG or PNG.';
				}
				// Re-throw the error
				throw error;
			}),
			// TODO: Hide loading spinner or progress bar
			finalize(() => {
				// TODO: Hide loading spinner or progress bar
			})
		);
	}

	removeUrlPath(url) {
		// Split the URL into sections using the forward slash as a separator
		const sections = url.split('/');

		// Get the last section of the URL
		const lastSection = sections[sections.length - 1];

		// Combine the last section back into a new URL
		const newUrl = lastSection;

		return newUrl;
	}
}
