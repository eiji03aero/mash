FROM node:12.7.0-buster

WORKDIR /projects

RUN yarn global add lerna
