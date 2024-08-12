# Eventshuffle API

Eventshuffle is an application to help scheduling events with friends, quite like http://doodle.com/ but in a much simplified way. An event is created by posting a name and suitable dates to the backend, events can be queried from the backend and participants can submit dates suitable for them.

## Folder Structure

```bash
root
|──src
|    |──config
|    |    ├──db.ts
|    |──controllers
|    |    ├──event
|    |    |    ├──index.ts
|    |    ├──user
|    |    |    ├──index.ts
|    |──middleware
|    |    ├──auth.ts
|    |──models
|    |    ├──event.ts
|    |    ├──user.ts
|    |    ├──vote.ts
|    |──routes
|    |    ├──event
|    |    |    ├──index.ts
|    |    ├──user
|    |    |    ├──index.ts
|    |    ├──index.ts
|    |──services
|    |    ├──event
|    |    |    ├──index.ts
|    |    ├──user
|    |    |    ├──index.ts
|    |──utils
|    |    ├──formatDate.ts
|    |    ├──formatEventResponse.ts
|    |──tests
|    |    ├──event.test.ts
|    |──.env
|    |──.env.example
|    |──.gitignore
|    |──index.ts
|    |──jest.config.ts
|    |──package.json
|    |──package-lock.json
|    |──README.md
|    |──tsconfig.json
```

## Project checklist

- [x] Setup the base structure
- [x] Set up the root file
- [x] Set up models
- [x] Set up routes
- [x] Set up the service logics of the routes
- [ ] Swagger documentation
- [x] Test cases
- [x] Smoke testing
