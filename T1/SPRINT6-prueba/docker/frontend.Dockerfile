FROM node:20-slim

WORKDIR /app

COPY ../frontend/package*.json ./
RUN npm install

COPY ../frontend .

EXPOSE 8978

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8978"]
