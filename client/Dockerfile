FROM node:20

RUN mkdir -p /app/client
WORKDIR /app/client

COPY package*.json /app/client/

RUN npm install --silent

COPY . /app/client/

RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]