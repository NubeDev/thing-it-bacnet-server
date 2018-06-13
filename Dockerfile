# specify the node base image with your desired version node:<version>
FROM node:latest
# replace this with your application's default port
COPY ./dist /dist
COPY ./edefiles /edefiles
COPY ./node_modules /node_modules
CMD node ./dist/index --filePath /edefiles/$FILE
