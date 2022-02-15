rsync -avz --delete \
    --exclude rsync_deploy.sh \
    ./ lockex1987@103.142.26.170:/var/www/html/static/learn-threejs
