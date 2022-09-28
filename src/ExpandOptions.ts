export type ExpandOptions = {
  /**
   * Expand all zip files
   * Set this value to undefined to prevent unzip
   * @default ()
   */
  unzip?: {
    zipExtensions?: string[];
  };
  /**
   * Expand all gzip files
   * Set this value to undefined to prevent ungzip
   * @default ()
   */
  ungzip?: {
    gzipExtensions?: string[];
  };
};
