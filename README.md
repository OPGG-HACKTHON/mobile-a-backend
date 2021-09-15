# CHAI Server

<p align="center">
<!-- <img src="https://user-images.githubusercontent.com/54793607/133380331-9af0053a-c2e4-41ce-b2b7-33203cfa8828.png" width=200px height=200px> -->
<img src="https://user-images.githubusercontent.com/54793607/133405364-e2753cdd-812a-4320-b544-80a3886e73ec.jpeg">
</p>

## 차이

<strong>더욱 재밌게 즐기는 리그오브레전드 랭킹, 타이틀 앱 서비스</strong>

> <strong>OPGG 1th HACKATHON</strong><br>
> 프로젝트 기간: 2021.07.05 ~ 09.17

<br>

### <strong>CHAI Server</strong>


|                김강산                 |                      권세훈                       |
| :-----------------------------------: | :-----------------------------------------------: |
| [whywhyy](https://github.com/whywhyy) | [devkwonsehoon](https://github.com/devkwonsehoon) |

<br>

### <strong>CHAI Used</strong>

<br>
<p>
<img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/>
<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img alt="AWS" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/><br>
<img alt="Jest" src="https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=jest&logoColor=white"/>
<img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white"/>
<img alt="Riot Games" src="https://img.shields.io/badge/Riot Games-D32936.svg?style=for-the-badge&logo=Riot Games&logoColor=white"/>
<img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black"/>
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=ESLint&logoColor=white"/>
</p>
  
<br>

### <strong>CHAI API Docs</strong>

[차이 API 명세서](https://api.opggmobilea.com/docs/)

<br>

### <strong>CHAI Server Architecture</strong>

![무제 001](https://user-images.githubusercontent.com/54793607/133400949-f690aacc-8e3f-4010-beed-0093d943e3c6.png)

<br>

### <strong>CHAI Settings</strong>

<details>
  <summary><b>Docker Setup</b></summary>

```bash
# postgresql - 추가사항 : AWS Aurora PostgreSQL LTS version 11.9.
docker run --name postgresmobilea -e POSTGRES_PASSWORD=postgresmobilea -e POSTGRES_USER=postgresmobilea -e POSTGRES_DB=mobilea -p 5432:5432 -d postgres:11.9

#

## prod run for local

#

npm install

# npm run db-push:local

npm run build
docker build -t mobilea .

# prod docker image run

docker run -it -p 2000:3000/tcp --link postgresmobilea:postgresmobilea -e SCHEMA_NAME='localschema' -e DATABASE_URL="postgresql://postgresmobilea:postgresmobilea@postgresmobilea:5432/mobilea?schema=localschema" -e LOL_API_KEY='@@@@@@@APIKEY@@@@@@@' -e PORT=3000 --name mobilea mobilea

```

</details>

<details>
  <summary><b>Prisma Guide</b></summary>

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

</details>
