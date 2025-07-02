Pour scanner nginx 

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/Library/Caches:/root/.cache/ \
aquasec/trivy:latest image nginx:latest

Pour avoir une sortie

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/Library/Caches:/root/.cache/ \
aquasec/trivy:latest image --format json nginx:latest > scan-results.json



TP exercice 1

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/Library/Caches:/root/.cache/ \
aquasec/trivy:latest image --format table --severity HIGH,CRITICAL nginx:1.20 > scan-results2.json

140 vulnérabilitées hautes et critiques 



Exercice 4

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
-v $HOME/Library/Caches:/root/.cache/ \
-v $(pwd)/.trivyignore:/root/.trivyignore \
aquasec/trivy:latest image --format table --severity HIGH,CRITICAL nginx:latest > scan-results2.json


Exercice 5

Dans le dossier exo 5

Exercice 6

docker run --rm -v $(pwd):/project aquasec/trivy:latest config /project/docker-compose.yaml


Exercice 7

