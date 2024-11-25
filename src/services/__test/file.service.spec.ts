import { FileService } from "../files/file.service";

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    service = new FileService();
  });

  it('should extract the file part from base64 data', () => {
    const base64data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
    const filePart = service.getFile(base64data);
    expect(filePart).toBe('iVBORw0KGgoAAAANSUhEUgAA...');
  });

  it('should return the same base64 data if no comma is found', () => {
    const base64data = 'iVBORw0KGgoAAAANSUhEUgAA...';
    const filePart = service.getFile(base64data);
    expect(filePart).toBe(base64data);
  });

  it('should extract metadata part from base64 data', () => {
    const base64data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
    const metadataPart = service.getMetadatos(base64data);
    expect(metadataPart).toBe('data:image/png;base64,');
  });

  it('should return the same base64 data if no comma is found in metadata extraction', () => {
    const base64data = 'iVBORw0KGgoAAAANSUhEUgAA...';
    const metadataPart = service.getMetadatos(base64data);
    expect(metadataPart).toBe(base64data);
  });

  it('should combine file and metadata into a single base64 string', () => {
    const file = 'iVBORw0KGgoAAAANSUhEUgAA...';
    const metadata = 'data:image/png;base64,';
    const result = service.procesarMetadatos(file, metadata);
    expect(result).toBe(metadata + file);
  });

  it('should return base64 string with default metadata if only file is provided', () => {
    const file = 'iVBORw0KGgoAAAANSUhEUgAA...';
    const result = service.procesarMetadatos(file, null);
    expect(result).toBe('data:image/jpeg;base64,' + file);
  });

  it('should return undefined if both file and metadata are null', () => {
    const result = service.procesarMetadatos(null, null);
    expect(result).toBeUndefined();
  });

  it('should return undefined if only metadata is provided', () => { // Nueva prueba para cubrir la línea 45-46
    const result = service.procesarMetadatos(null, 'data:image/png;base64,');
    expect(result).toBeUndefined();
  });

  it('should convert base64 data URI to Blob', () => {
    const dataURI = 'aGVsbG8gd29ybGQ='; 
    const blob = service.dataURItoBlob(dataURI);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('should handle empty dataURI in dataURItoBlob', () => {
    const dataURI = '';
    const blob = service.dataURItoBlob(dataURI);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBe(0);
  });

  it('should process file and return base64 string', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const selectedFile = [mockFile];
    const result = await service.processFile(selectedFile);
    expect(result).toBeDefined();
  });

  it('should resolve to null if file processing fails', async () => {
    const selectedFile = [];
    const result = await service.processFile(selectedFile);
    expect(result).toBeNull();
  });

  it('should resolve to null if selectedFile is null', async () => { // Nueva prueba para cubrir la línea 64
    const result = await service.processFile(null);
    expect(result).toBeNull();
  });

  it('should reject with an error if FileReader fails', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const selectedFile = [mockFile];
    const errorEvent = new ProgressEvent('error') as unknown as ProgressEvent<FileReader>;
    
    jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementationOnce(function (this: FileReader) {
      setTimeout(() => {
        if (this.onerror) {
          this.onerror(errorEvent);
        }
      }, 0);
    });
  
    await expect(service.processFile(selectedFile)).rejects.toThrow('Error reading file');
  }, 10000); // Aumenta el timeout a 10 segundos

  it('should return base64 string from cargarArchivo', async () => {
    const mockFile = new Blob(['file content'], { type: 'text/plain' });
    const selectedFile = [mockFile];
    const result = await service.cargarArchivo(selectedFile);
    expect(result).toBeDefined();
  });

  it('should validate file type as true for png, jpg, jpeg', () => {
    expect(service.validarTipoArchivo('image.png')).toBe(true);
    expect(service.validarTipoArchivo('image.jpg')).toBe(true);
    expect(service.validarTipoArchivo('image.jpeg')).toBe(true);
  });

  it('should validate file type as false for other extensions', () => {
    expect(service.validarTipoArchivo('image.gif')).toBe(false);
    expect(service.validarTipoArchivo('document.pdf')).toBe(false);
  });

  it('should validate file size correctly', () => {
    expect(service.validarTamanoArchivo(500, 1000)).toBe(true);
    expect(service.validarTamanoArchivo(1500, 1000)).toBe(false);
  });

  it('should return false if file size is equal to configured size', () => {
    expect(service.validarTamanoArchivo(1000, 1000)).toBe(false);
  });

  it('should handle edge case for empty string in validarTipoArchivo', () => {
    expect(service.validarTipoArchivo('')).toBe(false);
  });

  it('should handle edge case for no extension in validarTipoArchivo', () => {
    expect(service.validarTipoArchivo('filename')).toBe(false);
  });

  it('should handle edge case for file with only a dot in validarTipoArchivo', () => { // Nueva prueba para cubrir la línea 80
    expect(service.validarTipoArchivo('.')).toBe(false);
  });
});
