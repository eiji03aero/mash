.PHONY: build
build:
	go build -o ./bin/app ./cmd/app/main.go

.PHONY: run
run:
	reflex -r '(\.go|go\.mod)' -s go run ./cmd/app/*.go

.PHONY: test
test:
	go test -v --cover ./...

.PHONY: test-w
test-watch:
	reflex -r '(\.go|go\.mod)' -s make test

.PHONY: g-mock
g-mock:
	mockery -all -output ./testutils/mocks

.PHONY: g-gql
gql-g:
	go run github.com/99designs/gqlgen generate
