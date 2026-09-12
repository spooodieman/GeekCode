FROM python:3.10-alpine3.22

WORKDIR /home/app
# Avoid buffering logs
ENV PYTHONUNBUFFERED=1

# System deps for building some wheels (uvloop/httptools)
RUN apk add --no-cache build-base libffi-dev

# Install Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application source
COPY src /home/app/src

RUN mkdir -p /home/ctf_player /home/.real_player

COPY player/.secret /home/ctf_player
COPY player/zhanda.txt /home/ctf_player
COPY player/yeh-kya-hai/flag.txt  /home/.real_player


#Saftey net

#Root owning the dir to prevent rm /home

RUN chown root:root /home

RUN chmod 755 /home \
    && chmod 755 /home/ctf_player \
    && chmod 755 /home/.real_player


RUN chmod 444 /home/ctf_player/.secret \
    && chmod 444 /home/ctf_player/zhanda.txt \
    && chmod 444 /home/.real_player/flag.txt


RUN addgroup -S ctf \
    && adduser -S -H -D -G ctf ctf

RUN chown -R ctf:ctf /home/app

# RUN chown -R ctf:ctf /home/.real_player \
#     && chmod 711 /home/.real_player \
#     && chmod 444 /home/.real_player/flag.txt

# # RUN chmod 500 /home/ctf_player \
# RUN chown -R ctf:ctf /home/ctf_player \
#     && chmod 711 /home/ctf_player \
#     && chmod 444 /home/ctf_player/.secret \
#     && chmod 444 /home/ctf_player/zhanda.txt

USER ctf

# Default port for local dev; Render provides $PORT at runtime
EXPOSE 8000

# Start FastAPI app with Uvicorn, binding to provided $PORT or 8000
CMD ["sh", "-c", "uvicorn src.app:app --host 0.0.0.0 --port ${PORT:-8000}"]