from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
import yt_dlp
import uvicorn
import logging
import os
import tempfile
import time
from typing import Optional

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="YuliusBox Video Extractor Microservice")

# --- 鉴权配置 ---
# TODO: 部署时请修改此密钥，并确保与 Vercel 端的 VPS_API_KEY 一致
SECRET_API_KEY = "yulius_secret_#*!_2026"

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != SECRET_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")

# --- 请求模型 ---
class ExtractRequest(BaseModel):
    url: str
    proxy: Optional[str] = None  # 支持传入代理: http://user:pass@ip:port

# --- 核心提取逻辑 ---
@app.post("/api/extract", dependencies=[Depends(verify_api_key)])
async def extract_video(request: ExtractRequest):
    # 抖音分享链接通常包含文案，需要提取真实 URL
    # 例如: "https://v.douyin.com/GMh4jlA6dKs/ jCh:/ i@C.uS 07/31" -> "https://v.douyin.com/GMh4jlA6dKs/"
    import re
    url_match = re.search(r'(https?://[^\s]+)', request.url)
    clean_url = url_match.group(0) if url_match else request.url
    
    logger.info(f"Received extraction request for: {clean_url} (Original: {request.url})")
    request.url = clean_url
    
    # yt-dlp 配置: 这里的核心是 'skip_download': True
    ydl_opts = {
        'format': 'best',  # 获取最佳质量
        'quiet': True,     # 静默模式，减少日志垃圾
        'no_warnings': True,
        'skip_download': True, # CRITICAL: 仅提取信息，绝不下载视频文件
        'socket_timeout': 15,  # 防止请求挂起太久
    }

# --- Cookie 文件管理 (全局单例) ---
COOKIES_FILE_PATH = os.path.join(tempfile.gettempdir(), "douyin_cookies.txt")

def generate_cookie_file():
    """在启动时生成一次 Cookie 文件"""
    
    # 抖音 Cookie (硬编码以通过验证)
    DOUYIN_COOKIES = "passport_csrf_token=a9e6afcf1c58c8ad42bf438bfb98957b; passport_csrf_token_default=a9e6afcf1c58c8ad42bf438bfb98957b; enter_pc_once=1; UIFID_TEMP=e4c262a6b5e3b5badbd561631828ceb96cf9bda1502c8aff5f66458d92ccf6f3badc150046fe8fbfb39e8136f2fb87a215c9d6fb1c0ad562b5557c1646ddb47f8e395e59e89d879517796d5a30abf1ac; hevc_supported=true; strategyABtestKey=%221771065949.274%22; odin_tt=017ff4ec1217167d21cb98527ebaf422a2e7e92a8e4d57b14c38c464b16e105fafb296943fd3b8c5b964512146de0261b1c985a2832a07a30bfaa833297f994c8a687cce44747c7220156ba94f8c9f73; __security_mc_1_s_sdk_crypt_sdk=6f9269cd-4fe2-8434; bd_ticket_guard_client_web_domain=2; UIFID=e4c262a6b5e3b5badbd561631828ceb96cf9bda1502c8aff5f66458d92ccf6f3badc150046fe8fbfb39e8136f2fb87a2c38e05bbb936f12b533e0e463aba81128681d0a285457faa391353eecc7590d0d0c6410038f6bd84636227c512a815b27d5690b52853fc9e4b4724e8d13596cff2f35dcb5680fcf1f1df55e061519236da3b9ac33e5480d0c3430b7a37083bea6919a5a95b080b19780ddca626c64d42; is_dash_user=1; volume_info=%7B%22isUserMute%22%3Afalse%2C%22isMute%22%3Atrue%2C%22volume%22%3A0.5%7D; gulu_source_res=eyJwX2luIjoiMmMwYzJkZGRkYTgwMzhlNjQwZDA1MTNlODFmZjUxYzA4MDBlMjQ0Y2Q4M2QzNTIyMzAzN2Y1MjVmZDAyY2VjYSJ9; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f27353c33303d3135323534323234272927676c715a75776a716a666a69273f2763646976602778; bit_env=882Z3UCnch3XLK6SFE-nv1tMrccF9ZOKrDl1UETTJpq1vtrSu5GNKRQH4nKUnb9vmVIXOWCpAVeWlLXgAl1_8mQ2vfGOq2aKbBBo53Ur_4o3RyaBWekJGbiKXfJiRfmMtzwSKqVeRFn7BO0uf70tJ7mPD0bX6k2CUe6qZowrQZ5xM5SWF1qf6n23b7ssdTuVQlVe1N7BcjcrxuYeuVZTv40-iaIlNuvI_O9oX1HsCQDPWAorz70cMy7NxsxSBkUfvRweQBhknXh9ruBUVw-imMfc1sst8xhIQ9dTZIA4GCAsko2LTISN-NnKYyAS9f1BGXXlw_SlTc8xDWfembCU4jlDFcYvisnzGcULMwkNfyExu9hoV8uYobQfilcOhHlQnLFpe4PfgMHDe7JhgZkYmpMPNd0gopodsUOz6e2UxaddbciVh4xIgJ2z4GBPyTu2yzIK7G7E-hnhVO9n-1YNcC6leh5uZtxWZVsBP31Th61Lbq3CwDTZfu91UDlvpaQSM-JdPJzgF5mHhj957NPd8owLTZcz-pH603vkS7HtTeA%3D; passport_auth_mix_state=u2h570ohqsgpu1h1z14wy6zcgv7p022sex4ily7jbjwek8fc; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1440%2C%5C%22screen_height%5C%22%3A900%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A2%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A0.45%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A200%7D%22; record_force_login=%7B%22timestamp%22%3A1771065948126%2C%22force_login_video%22%3A4%2C%22force_login_live%22%3A0%2C%22force_login_direct_video%22%3A3%7D; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCQURTb1A4WVRxMDc4UlFhYTI4Tzg4QUNkSHprYlJVc3lSRm01VlBDb1lIbEc1UGJ2NkVadzZ4RS9UWk1vM2dsM0NKZ3BUVFVBNi9qa3cwK0NlSmJ1S1E9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; bd_ticket_guard_client_data_v2=eyJyZWVfcHVibGljX2tleSI6IkJBRFNvUDhZVHEwNzhSUWFhMjhPODhBQ2RIemtiUlVzeVJGbTVWUENvWUhsRzVQYnY2RVp3NnhFL1RaTW8zZ2wzQ0pncFRUVUE2L2prdzArQ2VKYnVLUT0iLCJyZXFfY29udGVudCI6InNlY190cyIsInJlcV9zaWduIjoiUWhmRDlSeXBNZGQ5cnE3ZDBPN3ZSdmxDZ1BEbU9saTVPTm9RRkV5bGNpbz0iLCJzZWNfdHMiOiIjb3Z3ak1TSzZ5MjJ5dFhjVzVESWpoTkoyeGd4TUY5Z0hWTnNrVWtXTm5ReFRRQllSd3hQaS9xRzRENDdsIn0%3D; ttwid=1%7CkZ3OiSqPnj1XIFNlGKV9BOihILlVnAqhd_KaqsQh6cw%7C1771070578%7Ca2a8d6c1ec5faa540503426bb999dfa665e7943528e49019ef19cd7197dc93e0; biz_trace_id=16dbadc9; home_can_add_dy_2_desktop=%221%22; IsDouyinActive=true; download_guide=%222%2F20260214%2F0%22"
    
    try:
        with open(COOKIES_FILE_PATH, 'w') as f:
            f.write("# Netscape HTTP Cookie File\n")
            f.write("# This file is generated by YuliusBox microservice.\n\n")
            
            raw_cookies = DOUYIN_COOKIES.split('; ')
            timestamp = int(time.time()) + 31536000 # 1 year validity
            
            for cookie in raw_cookies:
                if '=' in cookie:
                    try:
                        name, value = cookie.split('=', 1)
                        # domain flag path secure expiration name value
                        f.write(f".douyin.com\tTRUE\t/\tFALSE\t{timestamp}\t{name}\t{value}\n")
                        f.write(f"douyin.com\tTRUE\t/\tFALSE\t{timestamp}\t{name}\t{value}\n")
                    except Exception as e:
                        logger.warning(f"Failed to parse cookie segment: {cookie} - {e}")
        logger.info(f"Cookie file generated at: {COOKIES_FILE_PATH}")
    except Exception as e:
        logger.error(f"Failed to generate cookie file: {e}")

# 服务启动时生成 Cookie 文件
generate_cookie_file()

# --- 核心提取逻辑 ---
@app.post("/api/extract", dependencies=[Depends(verify_api_key)])
async def extract_video(request: ExtractRequest):
    # 抖音分享链接通常包含文案，需要提取真实 URL
    # 例如: "https://v.douyin.com/GMh4jlA6dKs/ jCh:/ i@C.uS 07/31" -> "https://v.douyin.com/GMh4jlA6dKs/"
    import re
    url_match = re.search(r'(https?://[^\s]+)', request.url)
    clean_url = url_match.group(0) if url_match else request.url
    
    logger.info(f"Received extraction request for: {clean_url} (Original: {request.url})")
    request.url = clean_url
    
    # yt-dlp 配置
    ydl_opts = {
        'format': 'best', 
        'quiet': True,     
        'no_warnings': True,
        'skip_download': True, 
        'socket_timeout': 15,
    }

    try:
        # 如果请求中包含了代理，且目标不是抖音（抖音国内直连通常更快），则挂载代理
        if "douyin.com" in request.url:
            logger.info("Skipping proxy (Direct connection) and using global cookie file for Douyin.")
            # 使用全局生成的 Cookie 文件
            if os.path.exists(COOKIES_FILE_PATH):
                ydl_opts['cookiefile'] = COOKIES_FILE_PATH
            else:
                logger.error("Cookie file missing, trying to regenerate...")
                generate_cookie_file()
                ydl_opts['cookiefile'] = COOKIES_FILE_PATH

        elif request.proxy:
            ydl_opts['proxy'] = request.proxy
            logger.info("Using provided proxy for extraction.")

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # extract_info(url, download=False) 是核心方法
            info = ydl.extract_info(request.url, download=False)
            
            # 尝试提取直链
            video_url = info.get('url')
            title = info.get('title', 'Unknown Title')
            thumbnail = info.get('thumbnail')
            duration = info.get('duration_string')
            uploader = info.get('uploader')

            # 如果直接 url 为空，尝试从 formats 列表中寻找最佳 mp4
            if not video_url:
                formats = info.get('formats', [])
                # 简单的过滤逻辑：找有视频+音频的 mp4，或者 fallback 到任意 url
                best_format = next((f for f in formats if f.get('vcodec') != 'none' and f.get('acodec') != 'none'), None)
                if best_format:
                    video_url = best_format.get('url')
                elif formats:
                    video_url = formats[-1].get('url')

            if not video_url:
                raise Exception("Failed to extract valid video URL.")

            return {
                "success": True,
                "title": title,
                "videoUrl": video_url, # 注意：Vercel 端期望的字段是 videoUrl
                "thumbnail": thumbnail,
                "duration": duration,
                "uploader": uploader
            }

    except yt_dlp.utils.DownloadError as e:
        logger.error(f"yt-dlp DownloadError: {str(e)}")
        return {
            "success": False,
            "error": "Video not found or access denied (DownloadError)."
        }
    except Exception as e:
        logger.error(f"General Error: {str(e)}")
        return {
            "success": False,
            "error": f"Extraction failed: {str(e)}"
        }
    finally:
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
