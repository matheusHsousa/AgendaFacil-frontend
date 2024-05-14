import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Base64Service {
  constructor() {}

  fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result !== null) {
          resolve(reader.result);
        } else {
          reject('Failed to read the file.');
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  convertBase64ToFile(base64String: string): File | null {
    if (typeof base64String !== 'string') {
      console.error('O valor fornecido não é uma string.');
      return null;
    }

    const match = base64String.match(/^data:([a-zA-Z]+\/[a-zA-Z]+);base64,/);

    if (!match) {
      console.error('Formato inválido da string base64.');
      return null;
    }

    const [, mimeType] = match;
    const base64WithoutHeader = base64String.split(';base64,').pop();

    if (!base64WithoutHeader) {
      console.error('Formato inválido da string base64.');
      return null;
    }

    const binaryString = atob(base64WithoutHeader);
    const byteArray = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    try {
      const blob = new Blob([byteArray], { type: mimeType });
      const fileName = `file_${Date.now()}.${mimeType.split('/').pop()}`;
      return new File([blob], fileName, { type: mimeType });
    } catch (error) {
      console.error('Erro ao criar Blob:', error);
      return null;
    }
  }
  
}
