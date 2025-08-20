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

  - npm i bcrypt
  - npm i --save-dev @types/bcrypt
  - with simple and well detailed code at /app/api/auth/register/route.ts

  - Testing:
    - /app/api/auth/register/

![alt text](<Screenshot 2025-08-16 at 23.41.26.png>)

- The above works perfectly for me.. and i hope it does for you,, if not,, the comit with title "Register" contains the code until this level.

However, yes it does work but we talking about production level so lets add some validations to our payload.. this will check the payload and validdates it before hitting running our code or hitting db at all.

- npm install zod

  - declare your dtos like /app/api/auth/register/dto.ts
  - updated code in /app/api/auth/register/route.ts to use our dto.
  - updated code in /prisma/schema.prisma user model.

  - Testing:
    - /app/api/auth/register/
    - Works same but better error handling expecially the email formart.

Email Verification:
There are severals ways to Validates email base on requirements and scalabilty,, I will introduce you to my way,, it doesn't matter how big the enterprise is or what programming language you using, it will work perfect..

however, whatever the method u chose, please don't use the db to store temporary verification code.. nah everything is wrong about it.. from populating db with unnessary data, to ridiculing db cause its db is suppose to be treated like a baby, meaningless cost and slow parformance, bad backend programming service,, i could go on and list 100 reasons, just don't do it. if u've taken some course and this is what u were thought,, drop that part now.

Heres where you learn tools like redis, not only for caching but also understand how it works, how to really utilize it..
