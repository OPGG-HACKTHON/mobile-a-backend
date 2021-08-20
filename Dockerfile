FROM node:14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

EXPOSE 2000-19999

CMD npm run migrate && npm run start:prod
