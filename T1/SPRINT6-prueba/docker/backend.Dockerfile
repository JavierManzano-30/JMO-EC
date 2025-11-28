FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \ 
    plantuml graphviz pandoc && rm -rf /var/lib/apt/lists/*

COPY ../backend/package*.json ./
RUN npm install

COPY ../backend .

RUN mkdir -p output uploads storage

EXPOSE 3001

CMD ["npm", "start"]
