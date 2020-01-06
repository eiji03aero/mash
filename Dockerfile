FROM node:10.18.0-buster

WORKDIR /projects

RUN yarn global add lerna
