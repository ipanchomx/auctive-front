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
        let selectedFile: ImageAsset = { src: event.target.result.toString(), file: image };
        resolve(selectedFile);
      }

      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(null);
      }
      reader.readAsDataURL(image);
    })

  }

  async processMultipleImages(files: FileList): Promise<ImageAsset[]> {
    let images: Promise<ImageAsset>[] = Array.from(files).map((file: File) => {
      return this.readFileAsDataUrl(file)
    });

    try {
      let fileArray: ImageAsset[] = await Promise.all(images);
      return fileArray;
    } catch (error) {
      return [];
    }
  }

  private readFileAsDataUrl(file: File): Promise<ImageAsset> {
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();
        fr.onload = function (event: any) {
          let img: ImageAsset = { src: event.target.result.toString(), file };
          resolve(img);
        };

        fr.onerror = function () {
          reject(null);
        };

        fr.readAsDataURL(file);
      });
  }

}
