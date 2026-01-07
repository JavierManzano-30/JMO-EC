FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    plantuml graphviz pandoc texlive-latex-base texlive-latex-recommended \
    texlive-latex-extra texlive-fonts-recommended lmodern && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p output uploads storage

EXPOSE 3001

CMD ["npm", "start"]
