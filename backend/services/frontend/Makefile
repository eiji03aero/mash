.PHONY: build
build:
	go build -o ./bin/app ./cmd/app/main.go

.PHONY: run
run:
	reflex -r '(\.go|go\.mod)' -s go run ./cmd/app/main.go
