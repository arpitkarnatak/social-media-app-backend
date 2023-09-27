FROM node:18-alpine

WORKDIR /app/be

COPY . .

RUN . .env
RUN echo Hello
RUN rm -rf node_modules
RUN npx prisma migrate deploy
RUN npx prisma generate


RUN npx tsc
EXPOSE 8080

CMD ["node", "dist/index.js"]