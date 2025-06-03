FROM node:18
WORKDIR /app
COPY runner.js .
RUN npm init -y && npm install express body-parser
EXPOSE 5004
CMD ["node", "runner.js"]
