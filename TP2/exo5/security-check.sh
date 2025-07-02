IMAGE=$1

if [ -z "$IMAGE" ]; then
  echo "Usage: $0 <image>"
  exit 1
fi

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  -v $HOME/Library/Caches:/root/.cache/ \
  aquasec/trivy:latest image --severity CRITICAL --exit-code 1 --no-progress "$IMAGE"

if [ $? -eq 1 ]; then
  echo "Des vulnérabilités CRITIQUES ont été détectées dans l'image $IMAGE."
  exit 1
else
  echo "Aucun problème critique détecté dans l'image $IMAGE."
fi