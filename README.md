# Knuepf

[![pipeline status](https://gitlab.com/maxbause/knuepf/badges/master/pipeline.svg)](https://gitlab.com/maxbause/knuepf/commits/master)

Knuepf is a light weight, self-hostable, link bookmarking tool designed to be used in private networks or intranets.

:construction: This project is currently in a super early development stage and therefor not yet ready to be used. But feel free to stay around! :construction:

## Local development
For local development, follow these steps to get Knuepf up and running (no database required!):
- `git clone git@gitlab.com:maxbause/knuepf.git` 
- `cd knuepf`
- `bundle exec rake db:setup`
- `bundle exec rails server`
- Start the frontend server in a second terminal window: `cd frontend; npm run watch`
- Knuepf is now running: [http://localhost:3000](http://localhost:3000)

### Run tests
- `bundle exec rspec`
- `cd frontend; npm run test:unit`

### Run linters
- `bundle exec rubocop`
- `cd frontend; npm run lint`
