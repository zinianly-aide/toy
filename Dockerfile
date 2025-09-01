# 使用已经拉取的busybox镜像作为基础镜像
FROM busybox:latest

# 维护者信息
LABEL maintainer="calculus-tutorial"

# 创建工作目录
WORKDIR /app

# 将网站文件复制到工作目录
COPY . /app

# 暴露80端口
EXPOSE 80

# 使用busybox的httpd命令启动服务
CMD ["httpd", "-f", "-p", "80", "-h", "/app"]