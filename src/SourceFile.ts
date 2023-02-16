export interface SourceFile {
  relativePath: string;
  name: string;
  lastModified?: number;
  size?: number;
  baseURL?: string;
}

export interface Source {
  entries: SourceFile[];
  baseURL?: string;
}
