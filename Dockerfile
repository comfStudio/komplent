FROM mongo

ADD --chown=999:999 ./mongodb_keyfile /data/mongodb_keyfile
RUN chmod 400 /data/mongodb_keyfile