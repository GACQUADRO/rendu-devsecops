const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN
});

async function getSecret(path) {
    try {
        const secret = await vault.read(path);
        return secret.data.data;
    } catch (error) {
        console.error(`Error retrieving secret from Vault: ${error.message}`);
        throw error;
    }
}

async function main() {
    try {
        const dbConfig = await getSecret('secret/data/app/database');
        const apiKeys = await getSecret('secret/data/app/api-keys');

        console.log('Database Configuration:', dbConfig);
        console.log('API Keys:', apiKeys);
    } catch (error) {
        console.error('Failed to retrieve secrets:', error);
    }
}

main();