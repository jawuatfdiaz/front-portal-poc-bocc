import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FileService {
  // constructor() {}

  getFile(base64data: string) {
    const pos = base64data.indexOf(",");
    if (pos > -1) {
      return base64data.substring(pos + 1);
    }
    return base64data;
  }

  getMetadatos(base64data: string) {
    const pos = base64data.indexOf(",");
    if (pos > -1) {
      return base64data.substring(0, pos + 1);
    }
    return base64data;
  }

  procesarMetadatos(file: any, fileMetadatos: any): any {
    let fileBase64: any;
    if (file && fileMetadatos) {
      fileBase64 = fileMetadatos + file;
    } else if (file) {
      fileBase64 = "data:image/jpeg;base64," + file;
    }
    return fileBase64;
  }

  dataURItoBlob(dataURI: string): Blob {
    try {
      const byteString = window.atob(dataURI);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      return new Blob([int8Array]);
    } catch (e) {
      return new Blob();
    }
  }

  processFile(selectedFile: any): Promise<string | null> {
    if (!selectedFile || selectedFile.length === 0) {
      return Promise.resolve(null);
    }
    const file = selectedFile[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onloadend = function () {
        const base64data = reader.result;
        const base64 = base64data.toString().split(",");
        if (base64[1]) {
          resolve(base64[1].toString());
        } else {
          resolve(null);
        }
      };
      reader.onerror = function () {
        reject(new Error("Error reading file"));
      };
    });
  }

  cargarArchivo(file: any) {
    return new Promise((resolve, reject) => {
      this.processFile(file)
        .then((array) => {
          resolve(array);
        })
        .catch((error) => {
          reject(error instanceof Error ? error : new Error(error));
        });
    });
  }
  validarTipoArchivo(nombreArchivo: string) {
    const nombreFile = nombreArchivo.toLowerCase().split(".");
    const extensionArchivo = nombreFile[nombreFile.length - 1];

    if (extensionArchivo === "png") {
      return true;
    } else if (extensionArchivo === "jpg") {
      return true;
    } else if (extensionArchivo === "jpeg") {
      return true;
    } else {
      return false;
    }
  }

  validarTamanoArchivo(
    tamano: number,
    tamanoConfiguradoArchivoAdjunto: number
  ) {
    if (tamano >= tamanoConfiguradoArchivoAdjunto) {
      return false;
    } else {
      return true;
    }
  }
}
