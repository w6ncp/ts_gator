# gator

gator is my version of the Boot.dev RSS feed aggregator, written in TypeScript

## Required

This project requires a Node.js installation and postgress SQL server running.

## Installation

Use NVM to install the correct version of Node.js and the NPM command to install the needed packages for the gator cli.

```bash
nvm use
npm install

```
## Configuration

Create a `.gatorconfig.json` file in your home directory with the following structure:

```json
{
  "db_url": "postgres://[username]:[password]@localhost:5432/database?sslmode=disable"
}
```

Replace the values with your database connection string.

## Usage

Create a new User:
```bash
gator register <username>
```
Login as an existing User:
```bash
gator login <username>
```
Add a Feed for the current User:
```bash
gator add feed <feed_name> <feed_url>
```
Follow an existing Feed:
```bash
gator follow <feed_url>
```
Start the aggregator:
```bash
gator agg <time_delay>

#example:
gator agg 30s
```