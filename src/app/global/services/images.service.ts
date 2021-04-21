import { Injectable } from '@angular/core';
import { ImageAsset } from '../models/image-asset.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(
  ) { }

  processSingleImage(image: File) {
    const reader: FileReader = new FileReader();

    return new Promise<ImageAsset>((resolve, reject) => {
      reader.onload = (event: ProgressEvent<FileReader>) => {
        let selectedFile:ImageAsset = { src: event.target.result.toString(), file : image};
        resolve(selectedFile);
      }

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(null);
      }

      reader.readAsDataURL(image);
    })

  }

  processMultipleImages() {

  }
}
