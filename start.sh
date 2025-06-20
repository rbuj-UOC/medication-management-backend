#!/bin/bash
chmod 600 ./.docker/postgres/certs/key.pem
chmod 600 ./.docker/postgres/certs/cert.pem
docker-compose up
