#!/bin/bash
# Set to 100 years for development use
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout key.pem -out cert.pem -days 36500 \
  -subj "/C=ES/ST=Lleida/L=Lleida/O=UOC/OU=Students/CN=TFM"