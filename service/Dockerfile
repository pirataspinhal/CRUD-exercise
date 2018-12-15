FROM node:10.14.2-alpine

WORKDIR /usr/src/app

ADD . /usr/src/app

RUN npm install -g nodemon

ENV APP /usr/src/app/app.js

CMD ["nodemon -L", "$APP"]