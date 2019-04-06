# Mash-common

## Models

- ErrorBase
  - NoSuchFileOrDirectoryError
  - NotDirectory

- ErrorFactory

### ErrorBase

- properties
  - createdAt: string

- instance methods
  - message(): string


### NoSuchFileOrDirectoryError < ErrorBase

- properties
  - &ErrorBase
  - path: string

- instance
  - &ErrorBase

### NotDirectoryError < ErrorBase

- properties
  - &ErrorBase
  - name: string

- instance
  - &ErrorBase

### ErrorFactory

- static methods
  - noSuchFileOrDirectory
  - notDirectory

## Apis

- put color on string

- format string from color

- error factory
