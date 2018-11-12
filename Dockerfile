
FROM node:latest

COPY ./dist /app/dist
COPY ./package.json /app/package.json
RUN cd app && npm install
CMD node ./app/dist/index --filePath /edefiles/$FILE --dockerized
