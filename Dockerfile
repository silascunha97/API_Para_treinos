# --- STAGE 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência e o schema do Prisma (necessário para o postinstall "prisma generate")
COPY package*.json ./
COPY prisma ./prisma

# Instala todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copia o código fonte
COPY . .

# Compila o projeto (caso use TypeScript)
RUN npm run build --if-present

# --- STAGE 2: Runner (Produção) ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia apenas o necessário do estágio de build
COPY package*.json ./
# --ignore-scripts evita rodar o postinstall "prisma generate": o cliente já vem
# pré-compilado em dist/generated e o CLI do Prisma (devDependency) não existe aqui.
RUN npm ci --only=production --ignore-scripts

COPY --from=builder /app/dist ./dist

# Expõe a porta do servidor GraphQL/Express
EXPOSE 4000

# Executa a aplicação
CMD ["node", "dist/index.js"]