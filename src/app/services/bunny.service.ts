import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import {AfsService} from "./afs.service";

@Injectable({
  providedIn: 'root',
})
export class BunnyService {
  http = inject(HttpClient);
  basePath = 'https://sg.storage.bunnycdn.com/df24/pasoll/questions';
  bunnyKey = '8b37fb58-0189-4802-a40f9e5884d5-8ebc-446d';
  sz_name = 'df24'
  sz: BunnyStorageSDK.StorageZone;
  afs = inject(AfsService)

  constructor() {
    this.sz = BunnyStorageSDK.zone.connect_with_accesskey(BunnyStorageSDK.regions.StorageRegion.Singapore, this.sz_name, this.bunnyKey);
  }

  putFileToBunny(file: File, id: string, isQuestion: boolean = true) {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1);
    const path = `${this.basePath}/${id}/${id}_${isQuestion ? 'q' : 'a'}.${ext}`;
    return this.http.put(path, file, {
      headers: {
        'AccessKey': this.bunnyKey,
        'Content-Type': 'application/octet-stream',
        'accept': 'application/json',
      }
    })
  }
  deleteFileFromBunny(path: string) {
    const fullPath =  `${this.basePath}/${path}`;
    return this.http.delete(fullPath, {
      headers: {
        'AccessKey': this.bunnyKey,
        'accept': 'application/json',
      }
    })
  }

}
