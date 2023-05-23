import { FileCollectionItem } from '../FileCollectionItem';

export type FilterOptions = {
  /**
   * Should we ignored files starting with dot
   * @default true
   */
  ignoreDotfiles?: boolean;
};

/**
 * Utility function that allows to filter files from a FileCollection ignore by default the dotFiles
 * @param fileCollection
 * @param options
 * @returns
 */
export async function maybeFilter(
  fileCollectionItems: FileCollectionItem[],
  options: FilterOptions = {},
): Promise<FileCollectionItem[]> {
  const { ignoreDotfiles = true } = options;
  if (ignoreDotfiles) {
    fileCollectionItems = fileCollectionItems.filter(
      (item) =>
        item.relativePath.split('/').filter((part) => part.startsWith('.'))
          .length === 0,
    );
  }
  return fileCollectionItems;
}
