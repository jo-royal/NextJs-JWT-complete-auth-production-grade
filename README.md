Lets walk through a secure design that includes refresh tokens, multiple devices, and blacklisting.

This gives you enterprise-level session management with Next.js REST APIs + Prisma 🔥

- npx create-next-app@latest auth-nextjs
- npm install prisma @prisma/client
- npx prisma init

  - This creates:
  - /prisma/schema.prisma
  - .env

- remove below code from datasource db in /prisma/schema.prisma -- ignore if you want to manually track the file.

  - output = "../app/generated/prisma"

- set up your db and .env, declare your 'DATABASE_URL'

  - for this setup, i use docker, in /docker-compose.yml

- declear user Model in /prisma/schema.prisma

  - npx prisma migrate dev --name init

- Create a prisma -db instance
  - /lib/prisma.ts/

Now lets get started with the fun!

- Regitration.
