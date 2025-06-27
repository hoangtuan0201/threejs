# Được kế thừa từ image chính đã chọn trong devcontainer.json
FROM mcr.microsoft.com/devcontainers/typescript-node:18-bullseye

# Cài đặt yarn nếu chưa có
RUN corepack enable && corepack prepare yarn@stable --activate

# Thiết lập thư mục làm việc
WORKDIR /workspace

# Copy package.json và yarn.lock để cài đặt dependencies trước
COPY package.json yarn.lock ./
RUN yarn install

# Copy toàn bộ mã nguồn
COPY . .

# Mặc định sẽ chạy bash
CMD ["bash"] 