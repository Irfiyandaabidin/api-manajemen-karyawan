# base imagenya ubuntu
FROM node:18.16.0

# command line dari ubuntu
RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY  . .

# install nodejs dependency
RUN npm install

EXPOSE 3000

ENTRYPOINT [ "node", "index.js" ]