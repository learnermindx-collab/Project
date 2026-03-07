# 1) Build frontend
FROM node:20 AS frontend-build
WORKDIR /app
COPY myapp/package*.json ./myapp/
RUN cd myapp && npm ci
COPY myapp ./myapp
RUN cd myapp && npm run build   # produces myapp/dist

# 2) Backend image
FROM node:20
WORKDIR /myapp
COPY package*.json ./
RUN npm ci --production
COPY . .
# copy built frontend into backend public folder
COPY --from=frontend-build /app/myapp/dist ./public

EXPOSE 5000
CMD ["npm","start"]
