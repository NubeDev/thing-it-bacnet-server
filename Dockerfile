
FROM node:latest

COPY ./dist /dist
COPY ./node_modules /node_modules
CMD node ./dist/index --filePath /edefiles/$FILE
