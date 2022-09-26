/** subset for File */

export type FileItem = Omit<File, 'slice' | 'type'>;
export type FileItemList = FileItem[];
