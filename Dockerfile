# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

FROM node:18.18.2-alpine AS development

ENV NODE_ENV development

RUN mkdir -p /usr/src/appdonations_dev
WORKDIR /usr/src/appdonations_dev

# Expose the port that the application listens on.

COPY ./package.json .

RUN yarn

COPY . .

RUN yarn build

FROM node:18.18.2-alpine AS production

RUN mkdir -p /usr/src/appdonations
WORKDIR /usr/src/appdonations

# Use production node environment by default.
ENV NODE_ENV production

COPY ./package.json .
COPY ./.sequelizerc .

RUN yarn

EXPOSE 3333

COPY --from=development /usr/src/appdonations_dev/build ./build

RUN yarn add -D sequelize-cli

# Run the application.
CMD yarn start
