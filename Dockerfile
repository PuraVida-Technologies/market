FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install webpack

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

COPY . .

EXPOSE 3000

CMD ["node", "dist/main"]
