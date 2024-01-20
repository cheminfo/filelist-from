import { Options } from './Options';

export interface WebSourceFile {
  relativePath: string;
  lastModified?: number;
  size?: number;
  baseURL?: string;
  options?: Options;
}

export interface WebSource {
  entries: WebSourceFile[];
  baseURL?: string;
}
