/** subset for File */

export type PartialFile = Omit<File, 'slice' | 'type'>;
export type PartialFileList = PartialFile[];
