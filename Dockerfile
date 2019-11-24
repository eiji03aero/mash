FROM node:12.13.1-buster

WORKDIR /projects

RUN yarn global add lerna
