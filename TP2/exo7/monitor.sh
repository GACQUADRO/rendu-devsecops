IMAGE=${1:-nginx:latest}
INTERVAL=${2:-3600} # Intervalle en secondes (par défaut 1h)

while true; do
  echo "[$(date)] Scan de l'image $IMAGE..."
  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    -v $HOME/Library/Caches:/root/.cache/ \
    aquasec/trivy:latest image --severity HIGH,CRITICAL --no-progress "$IMAGE" > "monitor-$IMAGE-$(date +%Y%m%d%H%M%S).log"
  echo "Scan terminé. Prochain scan dans $INTERVAL secondes."
  sleep $INTERVAL
done