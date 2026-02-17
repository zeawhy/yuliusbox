# 使用官方 Python 3.10 Slim 镜像 (Debian 12 based)
# 相比 Alpine，Slim 版本虽然稍大，但对 C 扩展和 ffmpeg 的兼容性更好
FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 1. 安装系统依赖
# yt-dlp 需要 ffmpeg 来处理流合并 (HLS/Dash)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 2. 复制依赖文件并安装 Python 库
# 设置 PIP 阿里源加速 (可选，如果 VPS 在国内)
# RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. 复制核心代码
COPY main.py .

# 4. 暴露端口 (仅作声明，实际需要在 docker run 时映射 -p 8000:8000)
EXPOSE 8000

# 5. 启动命令
# 使用 uvicorn 生产模式启动，绑定 0.0.0.0 允许外部访问
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
