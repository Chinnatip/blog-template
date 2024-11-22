# ใช้ Node.js LTS image
FROM node:18

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ lock file
COPY package.json yarn.lock ./

# ติดตั้ง dependencies
RUN yarn install

# คัดลอกโค้ดทั้งหมดเข้าไปใน container
COPY . .

# สร้าง Prisma Client
RUN npx prisma generate

# เปิด port 4000
EXPOSE 4000

ENV NODE_ENV=development

# รัน Prisma Migration & Seed Script แล้วเริ่ม Backend Server
# CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && yarn start"]
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then yarn dev; else yarn start; fi"]
