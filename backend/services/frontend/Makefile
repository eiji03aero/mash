.PHONY: build
build:
	go build -o ./bin/app ./cmd/app/main.go

.PHONY: run
run:
	reflex -r '(\.go|go\.mod)' -s go run ./cmd/app/*.go

.PHONY: test
test:
	go test -v --cover ./...

.PHONY: test-watch
test-watch:
	reflex -r '(\.go|go\.mod)' -s make test

.PHONY: mockery
mockery:
	mockery -all

.PHONY: gql-gen
gql-gen:
	go run github.com/99designs/gqlgen generate
