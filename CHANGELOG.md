# Changelog

## [1.2.0](https://github.com/cheminfo/filelist-utils/compare/v1.1.1...v1.2.0) (2022-11-06)


### Features

* add fileCollectionFromPaths ([cb71b52](https://github.com/cheminfo/filelist-utils/commit/cb71b522efbc61d9c226c94e49db37f2cf565a2a))


### Bug Fixes

* relativePath should always contain file.name and not '.' ([#49](https://github.com/cheminfo/filelist-utils/issues/49)) ([bfd802c](https://github.com/cheminfo/filelist-utils/commit/bfd802c1f31ae14e82570c53c580881dc0c96631))

## [1.1.1](https://github.com/cheminfo/filelist-utils/compare/v1.1.0...v1.1.1) (2022-10-27)


### Bug Fixes

* ignore dotFolder and included files ([9d0c6b4](https://github.com/cheminfo/filelist-utils/commit/9d0c6b47958e48a259a76dc72122d2aa27595b85))

## [1.1.0](https://github.com/cheminfo/filelist-utils/compare/v1.0.1...v1.1.0) (2022-10-27)


### Features

* filter out .dotFiles by default ([3f4622f](https://github.com/cheminfo/filelist-utils/commit/3f4622f6a797a297e9b4ad68b37bd3898d59505c))

## [1.0.1](https://github.com/cheminfo/filelist-utils/compare/v1.0.0...v1.0.1) (2022-10-15)


### Bug Fixes

* ungzip from nodejs ([206b156](https://github.com/cheminfo/filelist-utils/commit/206b156cc2f13a7f23589d5b342357283d6c2e1b))

## [1.0.0](https://github.com/cheminfo/filelist-utils/compare/v0.12.0...v1.0.0) (2022-10-14)


### Features

* add FileCollection.filter ([#41](https://github.com/cheminfo/filelist-utils/issues/41)) ([aca9e48](https://github.com/cheminfo/filelist-utils/commit/aca9e486d435fe23e46c6259e40dfad2ff47fd43))
* release as stable ([05e7ef6](https://github.com/cheminfo/filelist-utils/commit/05e7ef6295f330a6712b6a50e34a2187b78acd7e))

## [0.12.0](https://github.com/cheminfo/filelist-utils/compare/v0.11.0...v0.12.0) (2022-10-13)


### Features

* add fileCollectionFromFiles ([de54391](https://github.com/cheminfo/filelist-utils/commit/de543910f3f12562fcb06f07bdb1858e9aa46ff7))
* allow the absence of webkitRelativePath in FromFileList ([b1f371b](https://github.com/cheminfo/filelist-utils/commit/b1f371b07e8dadc8c9d8b0dbc1e41bf9701661eb))

## [0.11.0](https://github.com/cheminfo/filelist-utils/compare/v0.10.0...v0.11.0) (2022-09-29)


### ⚠ BREAKING CHANGES

* replace .items by .files

### Miscellaneous Chores

* replace .items by .files ([87c8cf6](https://github.com/cheminfo/filelist-utils/commit/87c8cf68e7754033256bd3b4df29884dc6fc879b))

## [0.10.0](https://github.com/cheminfo/filelist-utils/compare/v0.9.1...v0.10.0) (2022-09-29)

chore!: rename FileList to FileCollection
chore!: rename File to FileCollectionItem
chore!: rename webkitRelativePath to relativePath
feat: add fileCollectionFromFileList
refactor: remove baseName option and fix on Windows
feat: default unzip ungzip using fromFileList and fromWebService


### ⚠ BREAKING CHANGES

* rename FileList to FileCollection
* rename File to FileCollectionItem
* rename webkitRelativePath to relativePath
* create internal class containing items

### Features

* add fileCollectionFromFileList
* add fileCollectionFromPath
* add fileCollectionFromWebservice
* add fileCollectionFromZip

### Miscellaneous Chores

* create internal class containing items ([4633c4a](https://github.com/cheminfo/filelist-utils/commit/4633c4ac96595abbd6fc480ed7678728249740e7))

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
