# Warning

In order to run the docker container with the provided pem files, first you should change the file permissions on your computer.
Please note that github stores all files with group permissions, and the PostgreSQL server won't start if those files have group permissions for security.

```sh
chmod 600 cert.pem key.pem
```

You can generate your pem files by running the the command below:

```sh
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout key.pem -out cert.pem -days 36500
```
