import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { DropzoneComponent } from './dropzone.component';
import { FileService } from '../../../services/files/file.service';

describe('DropzoneComponent', () => {
  let component: DropzoneComponent;
  let fixture: ComponentFixture<DropzoneComponent>;
  let fileServiceMock: Partial<FileService>;

  beforeEach(async () => {
    fileServiceMock = {
      // Mock de cualquier método que necesites del servicio FileService
    };

    await TestBed.configureTestingModule({
      declarations: [DropzoneComponent],
      providers: [{ provide: FileService, useValue: fileServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should emit the selected files on file selection', () => {
  //   const files = [{ name: 'file1.txt' }, { name: 'file2.txt' }];
  //   const emitSpy = jest.spyOn(component.enviar, 'emit');
  //   const event = { target: { files: files } };

  //   component.onFileSelected(event);

  //   expect(emitSpy).toHaveBeenCalledWith(files);
  // });

  // it('should not upload files if gallery is undefined', async () => {
  //   const gallery = undefined;
  //   const uploadSpy = jest.spyOn(component, 'onUpload');

  //   await component.onUpload(undefined, gallery);

  //   expect(uploadSpy).not.toHaveBeenCalled();
  // });

  // it('should upload files to blob storage', async () => {
  //   const gallery = [{ name: 'file1.txt', customName: 'custom1.txt' }, { name: 'file2.txt', customName: 'custom2.txt' }];
  //   const uploadDataSpy = jest.fn().mockResolvedValue(undefined);
  //   const blockBlobClientMock = {
  //     uploadData: uploadDataSpy
  //   };
  //   const containerClientMock = {
  //     getBlockBlobClient: () => blockBlobClientMock
  //   };
  //   const blobServiceClientMock = {
  //     getContainerClient: () => containerClientMock
  //   };
  //   const fromConnectionStringSpy = jest.spyOn(DropzoneComponent.prototype as any, 'BlobServiceClient').mockReturnValue(blobServiceClientMock);

  //   await component.onUpload('connectionString', gallery);

  //   expect(fromConnectionStringSpy).toHaveBeenCalledWith('connectionString');
  //   expect(uploadDataSpy).toHaveBeenCalledTimes(2);
  //   expect(uploadDataSpy).toHaveBeenCalledWith(gallery[0], { blobHTTPHeaders: { blobContentType: undefined, blobContentDisposition: 'inline' } });
  //   expect(uploadDataSpy).toHaveBeenCalledWith(gallery[1], { blobHTTPHeaders: { blobContentType: undefined, blobContentDisposition: 'inline' } });
  // });
});