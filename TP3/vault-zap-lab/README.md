# Lab Vault & OWASP ZAP - Sécurisation et Test d'Applications

## Objectifs pédagogiques
- Comprendre la gestion sécurisée des secrets avec HashiCorp Vault
- Maîtriser les tests de sécurité automatisés avec OWASP ZAP
- Intégrer la sécurité dans le cycle de développement (DevSecOps)
- Identifier et corriger les vulnérabilités courantes

## Prérequis
- Docker et Docker Compose installés
- Git
- Un navigateur web
- 8 Go de RAM disponibles

## Structure du projet
```
vault-zap-lab/
├── docker-compose.yml
├── vault/
│   ├── config.hcl
│   └── policies/
│       └── app-policy.hcl
├── app/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── public/
│       └── index.html
└── scripts/
    ├── setup-vault.sh
    ├── run-zap-scan.sh
    └── vault-integration.js
```

## Installation et Configuration

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_DU_DEPOT>
   cd vault-zap-lab
   ```

2. **Démarrer l'environnement :**
   ```bash
   docker-compose up -d
   ```

3. **Configurer Vault :**
   ```bash
   chmod +x scripts/setup-vault.sh
   ./scripts/setup-vault.sh
   ```

4. **Accéder à l'application :**
   Ouvrez votre navigateur et allez à `http://localhost:3000`.

5. **Accéder à OWASP ZAP :**
   Ouvrez votre navigateur et allez à `http://localhost:8080`.

## Utilisation

- **Tester les vulnérabilités :**
  Utilisez les formulaires sur la page d'accueil pour tester les vulnérabilités comme l'injection SQL et XSS.

- **Exécuter un scan OWASP ZAP :**
  ```bash
  chmod +x scripts/run-zap-scan.sh
  ./scripts/run-zap-scan.sh
  ```

## Ressources complémentaires

- [Documentation Vault](https://www.vaultproject.io/docs)
- [Guide OWASP ZAP](https://www.zaproxy.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DevSecOps Best Practices](https://owasp.org/www-project-devsecops-guideline/)

## Nettoyage

Pour arrêter l'environnement :
```bash
docker-compose down -v
docker system prune -f
```