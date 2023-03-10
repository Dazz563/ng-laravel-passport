import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import imageCompression from 'browser-image-compression';
import {of, switchMap, map, catchError, finalize, Observable} from 'rxjs';
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

	/**
	 * Compresses and uploads an image to the server.
	 * @param imageFile The image file to upload.
	 * @returns An Observable that emits the response from the server.
	 */
	uploadImageWebCompress(args): Observable<any> {
		console.log('DOING COMPRESSED UPLOAD');
		console.log(args);
		// TODO: Show loading spinner or progress bar

		// Convert the imageFile to an Observable using the of() operator
		return of(args[1]).pipe(
			// Switch to the imageCompression() Observable to compress the image
			switchMap((file) => {
				console.log('file in the helper', file);

				// Check if the file is a GIF (not supported by the server)
				if (file.type.includes('gif')) {
					// Throw an error if the file is a GIF
					throw new Error('The given file was a gif, please upload a JPG or PNG.');
				}
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
				formData.append('file', compressedFile, 'imagename' + ext);
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
}
