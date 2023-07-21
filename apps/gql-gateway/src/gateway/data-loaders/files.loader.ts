import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader/dist';
import { FilesModel } from '../resolvers/files/models/files.model';
import * as DataLoader from 'dataloader';
import { HttpFilesService } from '@app/http-files';

@Injectable()
export class FilesLoader implements NestDataLoader<string, FilesModel | null> {
  constructor(private httpFilesService: HttpFilesService) {}

  generateDataLoader(): DataLoader<string, FilesModel | null> {
    return new DataLoader<string, FilesModel | null>(
      async (fileIds: string[]) => {
        const files = await this.httpFilesService.getFilesByIds(fileIds);

        //DataLoader must be constructed with a function which accepts Array<key> and returns Promise<Array<value>>,
        // the function must return a Promise of an Array of the same length as the Array of keys

        return fileIds.map((id) => {
          return files.find((file) => file.id === id) || null;
        });
      },
    );
  }
}
