FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install Postgres client tools (pg_isready)
RUN apt-get update && apt-get install -y postgresql-client

COPY . .

CMD ["npm", "run", "server"]
