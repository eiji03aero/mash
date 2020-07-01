# fs

## APIs

```
- create new FileSystem
  - supposedly be called when user is created
- cud file
  - read will be done by fsquery
- cud directory
  - read will be done by fsquery

```

## Entity

```
- FileSystem (Aggregate)
  - properties
    - id string
    - userId string
    - files map[string] File
    - directories map[string] Directory
  - invariants
    - no more than 100 files
    - no more than 100 directories

- File
  - properties
    - id string
    - name stinrg
    - content []byte
  - invariants
    - no more than 10kb for content

- Directory
  - properties
    - id string
    - name string

```
