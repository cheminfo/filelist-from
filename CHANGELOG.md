# Changelog

## [0.9.1](https://github.com/cheminfo/filelist-utils/compare/v0.9.0...v0.9.1) (2022-09-22)

### Bug Fixes

- force string for fetch ([5b19f07](https://github.com/cheminfo/filelist-utils/commit/5b19f07a4fefc0fdee13cbac00415e42874cf523))

## [0.9.0](https://github.com/cheminfo/filelist-utils/compare/v0.8.0...v0.9.0) (2022-09-22)

### ⚠ BREAKING CHANGES

- rename fileCollectionFromWS to fileCollectionFromWebservice

### Miscellaneous Chores

- rename fileCollectionFromWS to fileCollectionFromWebservice ([df98fac](https://github.com/cheminfo/filelist-utils/commit/df98fac8c55f701d3fb1a1b585b1b9cc42bdb24b))

## [0.8.0](https://github.com/cheminfo/filelist-utils/compare/v0.7.1...v0.8.0) (2022-09-19)

### Features

- add fileCollectionFromWS ([ccd0c8b](https://github.com/cheminfo/filelist-utils/commit/ccd0c8bead9d8bc808a4825e212f32e19cdf093c))

## [0.7.1](https://github.com/cheminfo/filelist-utils/compare/v0.7.0...v0.7.1) (2022-08-24)

### Bug Fixes

- keep ebkitRelativePath after gunzip and only change the name ([05eacf1](https://github.com/cheminfo/filelist-utils/commit/05eacf1671a9c2a8e48a1da93384e716ee19b8c6))

## [0.7.0](https://github.com/cheminfo/filelist-utils/compare/v0.6.0...v0.7.0) (2022-08-24)

### Features

- ungzip using native nodejs ([20d3afb](https://github.com/cheminfo/filelist-utils/commit/20d3afbe51bacf895086892c1368934e93748a5f))

## [0.6.0](https://github.com/cheminfo/filelist-utils/compare/v0.5.0...v0.6.0) (2022-08-19)

### ⚠ BREAKING CHANGES

- fileCollectionFromPath is now async and ungzip and unzip

### Features

- fileCollectionFromPath is now async and ungzip and unzip ([8245843](https://github.com/cheminfo/filelist-utils/commit/8245843b15f45f9beef71ed8a86e4134a7b8123c))
- first implementation of stream ([2c060da](https://github.com/cheminfo/filelist-utils/commit/2c060dad2102466b391bd2364a9d2ff88806bc3d))
- implementation of stream ([59e182c](https://github.com/cheminfo/filelist-utils/commit/59e182c6649ebcf39df7880b47482190b18ac2b3))

## [0.5.0](https://github.com/cheminfo/filelist-utils/compare/v0.4.0...v0.5.0) (2022-04-13)

### Features

- add fileCollectionItemsUngzip ([c09e3d5](https://github.com/cheminfo/filelist-utils/commit/c09e3d507ab388c57aa79eb5b9786e305694cfd9))

## [0.4.0](https://github.com/cheminfo/filelist-utils/compare/v0.3.0...v0.4.0) (2022-04-08)

### Features

- add groupFiles ([4d16f7b](https://github.com/cheminfo/filelist-utils/commit/4d16f7b231937d0b9f792e70a70805047721e025))
- expose FileItem and FileCollection ([c451ac3](https://github.com/cheminfo/filelist-utils/commit/c451ac37f011df433e47e4b51becfe702dd242ae))

## [0.3.0](https://github.com/cheminfo/filelist-utils/compare/v0.2.4...v0.3.0) (2022-03-18)

### Features

- add fileCollectionItemsUnzip method ([#13](https://github.com/cheminfo/filelist-utils/issues/13)) ([4876215](https://github.com/cheminfo/filelist-utils/commit/487621596f3fc795cbcdd84e0a42be3136d13d63))

### [0.2.4](https://github.com/cheminfo/filelist-utils/compare/v0.2.3...v0.2.4) (2022-03-08)

### Bug Fixes

- fileCollectionFromPath and relativePath ([2e3b7f1](https://github.com/cheminfo/filelist-utils/commit/2e3b7f102159fdf55e1668d51583356617e3b12c))
- fileCollectionFromZip and correct relativePath ([a136530](https://github.com/cheminfo/filelist-utils/commit/a13653063f13f6d4d389ceef4017506b64746963))

### [0.2.3](https://github.com/cheminfo/filelist-utils/compare/v0.2.2...v0.2.3) (2022-03-03)

### Bug Fixes

- replace back in relativePath ([#8](https://github.com/cheminfo/filelist-utils/issues/8)) ([84ae282](https://github.com/cheminfo/filelist-utils/commit/84ae28242285084a5ea720ed5c497d63fe05838e))

### [0.2.2](https://github.com/cheminfo/filelist-utils/compare/v0.2.1...v0.2.2) (2022-03-02)

### Bug Fixes

- correctly return a filelist from zip ([b579d2a](https://github.com/cheminfo/filelist-utils/commit/b579d2aa373e1835229f96ea4947d06b20446acc))

### [0.2.1](https://github.com/cheminfo/filelist-utils/compare/v0.2.0...v0.2.1) (2022-03-01)

### Bug Fixes

- export the type FileCollection ([818a69c](https://github.com/cheminfo/filelist-utils/commit/818a69c51c757f2d085c3ca0c31fa319efce48b9))

## [0.2.0](https://github.com/cheminfo/filelist-utils/compare/v0.1.0...v0.2.0) (2022-02-28)

### Features

- expose ZipFileContent type ([c478ae7](https://github.com/cheminfo/filelist-utils/commit/c478ae7804ad8553a7b53b0c4c251d4698602785))

### Bug Fixes

- File with omited properties ([9d5ecb8](https://github.com/cheminfo/filelist-utils/commit/9d5ecb84329ae3e548055c2026b14c594e407f37))
- lastModified set to milliseconds since unix epoch ([#3](https://github.com/cheminfo/filelist-utils/issues/3)) ([de58110](https://github.com/cheminfo/filelist-utils/commit/de58110a0528a90b0d8ab07c8f11bba6c21458e4))

## 0.1.0 (2022-02-25)

### Features

- first implementation ([0a74b71](https://www.github.com/cheminfo/filelist-utils/commit/0a74b71cd1838859852339933279ebc67a6bf495))
