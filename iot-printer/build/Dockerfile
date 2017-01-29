FROM hypriot/rpi-python
MAINTAINER Elze Kool

RUN pip install pika

RUN apt-get update \
 && apt-get install -y \
      python-serial \
      python-imaging \
      --no-install-recommends \
 && rm -rf /var/lib/apt/lists/*

