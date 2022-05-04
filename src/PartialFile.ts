/** subset for File */

export type PartialFile = Omit<File, 'stream' | 'slice' | 'type'>;
export type PartialFileList = PartialFile[];
