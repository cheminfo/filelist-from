import { FileCollectionItem } from '../FileCollectionItem';

export function sortCollectionItems(items: FileCollectionItem[]) {
  items.sort((a: FileCollectionItem, b: FileCollectionItem) =>
    a.relativePath < b.relativePath ? -1 : 1,
  );
}
