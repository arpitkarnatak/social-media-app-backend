FROM node:18-alpine

WORKDIR /app/be

COPY . .

RUN npx prisma generate

RUN npx tsc
EXPOSE 8080

CMD ["node", "dist/index.js"]