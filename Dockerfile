# ---- Stage 1: Build frontend ----
    FROM node:20 AS frontend-builder

    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm install
    COPY frontend/ ./
    RUN npm run build
    
    # ---- Stage 2: Build Go backend ----
    FROM golang:1.24 AS backend-builder
    
    WORKDIR /app
    COPY go.mod go.sum ./
    COPY vendor/ ./vendor/
    COPY . .
    RUN go build -mod=vendor -o server .
    
    # ---- Stage 3: Final minimal image ----
    FROM debian:bookworm-slim
    
    WORKDIR /app
    
    # Copy backend binary
    COPY --from=backend-builder /app/server .
    
    # Copy frontend build
    COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
    
    EXPOSE 8080
    CMD ["./server"]
    