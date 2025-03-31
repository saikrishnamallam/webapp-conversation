FROM --platform=linux/amd64 node:19-bullseye-slim

WORKDIR /app

COPY . .

# RUN yarn install
RUN npm install
RUN npx prisma db push
# RUN yarn build
RUN npm run build

EXPOSE 3000

# CMD ["yarn","start"]
CMD ["npm","run","start"]
