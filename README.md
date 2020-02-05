# Sustainability Project API

## Instructions

- Download `PostgresSQL` \
   MacOS

  > https://www.postgresql.org/download/macosx/

  Windows

  > https://www.postgresql.org/download/windows/

- Open up `pgAdmin`, a GUI to manage postgres databases, and create two databases, one named `sustainability_project` and another named `sustainability_project_test`

- Run `npm install` to install all node modules.

- Create a file called `.env` in the root directory of the project folder. There is an example of what it should look like in a file called `.env.example`

  > This file contains `environment variables` which usually has things like database url's and secret keys that we don't want to keep in the code base.

  Currently all you need to change in the `.env` file is the `DATABASE_URL` and `TEST_DATABASE_URL`

- Finally, run `npm run start` to start up a local server.
