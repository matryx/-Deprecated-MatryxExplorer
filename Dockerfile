FROM node:carbon

# Create app directory
WORKDIR /usr/src/app


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

RUN npm install -g forever
# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 4002
EXPOSE 5002
EXPOSE 8081

CMD ["npm","start"]
