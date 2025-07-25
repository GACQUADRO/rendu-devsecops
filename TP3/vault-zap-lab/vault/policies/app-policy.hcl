path: /vault-zap-lab/vault/policies/app-policy.hcl
content:
# Politique pour l'application
path "secret/data/app/*" {
  capabilities = ["read"]
}

path "secret/metadata/app/*" {
  capabilities = ["list", "read"]
}

path "database/creds/app-role" {
  capabilities = ["read"]
}