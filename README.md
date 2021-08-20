
## Docker setup

```bash
# postgresql - 추가사항 : AWS Aurora PostgreSQL LTS version 11.9.
docker run --name postgresmobilea -e POSTGRES_PASSWORD=postgresmobilea -e POSTGRES_USER=postgresmobilea -e POSTGRES_DB=mobilea -p 5432:5432 -d postgres:11.9

# # # # # # # # # # # #
## prod run for local #
# # # # # # # # # # # #
npm install
# npm run db-push:local
npm run build
docker build -t mobilea .
# prod docker image run
docker run -it -p 2000:3000/tcp --link postgresmobilea:postgresmobilea -e SCHEMA_NAME='localschema' -e DATABASE_URL="postgresql://postgresmobilea:postgresmobilea@postgresmobilea:5432/mobilea?schema=localschema" -e LOL_API_KEY='@@@@@@@APIKEY@@@@@@@' -e PORT=3000 --name mobilea mobilea
```

## Prisma 사용법

```bash
# # #
# Generate
# prisma client 라이브러리 사용시 데이터 정의 Lib
# prisma Client 사용중 model 이 정의되지 않을때 사용
# 보통은 prisma 관련명령어시 동작하여 이미 직용되어있음.
npm run generate

# # #
# DB Migrate 파일생성
# # prisma/schema.prisma 파일 변경후, migrate 파일을 생성하는 명령어 (DB 구조 변경 -> DDL 파일 생성)
# Migrate 의 파일이름은 변경사항
npm run migrate-dev

# # #
# DB Migrate
# # Migate Sync
# # 변경된 데이터 베이스 로컬에 반영 (변경된 DDL local DB 적용)
npm run migrate:local

# # #
# DB Push
# # Testing 전용
# # prisma/schema.prisma 를 바로 DB에 반영할때
npm run db-push:local

```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
