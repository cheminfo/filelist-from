import { FileCollectionItem } from './FileCollectionItem';
import { fileCollectionToZip } from './fileCollectionToZip';

export class FileCollection {
  readonly files: FileCollectionItem[];

  constructor(files: FileCollectionItem[]) {
    this.files = files;
  }

  filter(callback: (file: FileCollectionItem) => unknown) {
    return new FileCollection(this.files.filter(callback));
  }

  /**
   * Zip the FileCollection
   * This method returns a new FileCollection that contains only one FileItem that
   * is the zipped file (called by default 'file.zip')
   * Not sure this is super useful and we should probably remove it and replace it by fileCollectionToZip
   */
  async zip() {
    return fileCollectionToZip(this);
  }

  addText(
    relativePath: string,
    text: string,
    options: { dateModified?: number } = {},
  ) {
    this.files.push(getItemFromText(relativePath, text, options));
  }

  addArrayBuffer(
    relativePath: string,
    arrayBuffer: ArrayBuffer,
    options: { dateModified?: number } = {},
  ) {
    this.files.push(getItemFromArrayBuffer(relativePath, arrayBuffer, options));
  }

  addTypedArray(
    relativePath: string,
    typedArray: Uint8Array,
    options: { dateModified?: number } = {},
  ) {
    this.files.push(getItemFromTypedArray(relativePath, typedArray, options));
  }

  [Symbol.iterator]() {
    return this.files.values();
  }
}

function getItemFromText(
  relativePath: string,
  text: string,
  options: { dateModified?: number } = {},
): FileCollectionItem {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return {
    relativePath,
    name: relativePath.split('/').pop() as string,
    lastModified: options.dateModified || Date.now(),
    size: data.length,
    text: async () => {
      return text;
    },
    arrayBuffer: async () => {
      return data.buffer;
    },
    stream: () => {
      throw new Error('stream no implemented');
    },
  };
}

function getItemFromArrayBuffer(
  relativePath: string,
  arrayBuffer: ArrayBuffer,
  options: { dateModified?: number } = {},
): FileCollectionItem {
  const decoder = new TextDecoder();
  const text = decoder.decode(arrayBuffer);
  return {
    relativePath,
    name: relativePath.split('/').pop() as string,
    lastModified: options.dateModified || Date.now(),
    size: arrayBuffer.byteLength,
    text: async () => {
      return text;
    },
    arrayBuffer: async () => {
      return arrayBuffer;
    },
    stream: () => {
      throw new Error('stream no implemented');
    },
  };
}

function getItemFromTypedArray(
  relativePath: string,
  typedArray: Uint8Array,
  options: { dateModified?: number } = {},
): FileCollectionItem {
  return getItemFromArrayBuffer(relativePath, typedArray.buffer, options);
}
