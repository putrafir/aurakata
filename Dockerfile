# Pakai Node.js versi 20 yang kuat untuk Next.js 16+
FROM node:20-alpine

WORKDIR /app

# Copy daftar library dan install
COPY package.json package-lock.json* ./
RUN npm install

# Copy sisa kodingan
COPY . .

# Eksekusi build production
RUN npm run build

# Atur Port untuk Google Cloud Run
ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

# Jalankan server
CMD ["npm", "start"]