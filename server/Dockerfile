FROM node:20

# Create uploads folder and set permission for it to upload media
RUN mkdir -p /app/uploads
RUN chmod 777 -R /app/uploads

RUN mkdir -p /app/server
WORKDIR /app/server

COPY package*.json /app/server/

RUN npm install --silent
RUN npm install pm2 -g

COPY . /app/server/

RUN npm run build

EXPOSE 8000

CMD ["pm2-runtime", "dist/main.js"]
