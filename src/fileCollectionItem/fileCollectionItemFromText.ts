import { FileCollectionItem } from '../FileCollectionItem';

type FileCollectionFromOptionFromText = {
  lastModified?: number;
  size?: number;
  name?: string;
  relativePath?: string;
  /**
   * Encoding when converting text to arrayBuffer
   */
  encoding?: string;
};

/**
 * Generate a FileCollectionItem from a text
 * @example
 * const text='AABBCC'
 * const fileCollection = new FileCollection([FileCollectionFromOptionFromText(text)])
 * @param text
 * @param options
 * @returns
 */
export function fileCollectionFromText(
  text: string,
  options: FileCollectionFromOptionFromText = {},
): FileCollectionItem {
  return {
    lastModified: options.lastModified || Date.now(),
    name: options.name || '',
    relativePath: options.relativePath || '',
    size: options.size || text.length,
    arrayBuffer: () => {
      const textEncoder = new TextEncoder();
      return Promise.resolve(textEncoder.encode(options.encoding || 'utf8'));
    },
    stream: () => {
      throw new Error('Stream in not implemeted');
    },
    text: () => {
      return Promise.resolve(text);
    },
  };
}
