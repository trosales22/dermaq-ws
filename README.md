# DermaQ API

## Stack
- Adonis5 (TypeScript)
- MySQL

## Setup
- Run `npm install`
- Create database in your local mysql server
- Adjust the ff. in .env
```bash
  NODE_ENV=

  DB_CONNECTION=mysql
  MYSQL_HOST=
  MYSQL_PORT=
  MYSQL_USER=
  MYSQL_PASSWORD=
  MYSQL_DB_NAME=
  
  HASH_DRIVER=bcrypt
  
  TZ=Asia/Manila
```
- Then execute the ff.
```bash
node ace migration:run
node ace db:seed
node ace serve --watch
```

## Documentation
[https://docs.adonisjs.com/guides/introduction](https://docs.adonisjs.com/guides/introduction)
