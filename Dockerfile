FROM node:6.9

# Create app directory
RUN mkdir -p /usr/service
WORKDIR /usr/service

# Install app dependencies
# TODO - currently using local repos only so not using npm install just yet
# no .dockerignore file yet to exclude node_modules so everything at the moment
# should come with the COPY below
#COPY package.json /usr/service/
#RUN npm install

COPY . /usr/service

EXPOSE 8080
CMD [ "npm", "start" ]
