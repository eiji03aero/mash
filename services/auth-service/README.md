# auth-service
- Provides auth related service

# Components
- Event store
  - postgres
- DDD aggregate
  - can produce events to publish
  - methods
    - #apply
      - apply event to aggregate
- Command
- DomainEventPublisher
- CommandHandler
- EventConsumer
- Saga
  - orchestrator
- AuthService
  - application layer
- Event

# Usecases
## create user
- CommandHandler receives CreateUser command from frontend-service
  - invokes AuthService#createUser
    - invokes User.create
      - returns user, events
    - publish the events via DomainEventPublisher
  - returns the result to reply
