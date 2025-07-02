const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const vault = require('node-vault')({
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN
});

const app = express();
app.use(express.json());
app.use(express.static('public'));

const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Accès non autorisé : Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Token malformé ou invalide' });
    }

    if (token.startsWith('simulated-jwt-signed-with-')) {
        next(); 
    } else {
        return res.status(403).json({ error: 'Token invalide' });
    }
};

// Base de données SQLite en mémoire
const db = new sqlite3.Database(':memory:');

// Initialisation de la base
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        role TEXT DEFAULT 'user'
    )`);
    
    db.run(`INSERT INTO users VALUES 
        (1, 'admin', '$2b$10$8K1p/a0dVpn7N9Q7r5E4Mefm7zG4oC8kF9X2p1Z3q4E5t6R7y8S9', 'admin@example.com', 'admin'),
        (2, 'user', '$2b$10$9L2q/b1eWqo8O0R8s6F5Nfgn8aH5pD9lG0Y3q2a4r5F6g7H8i9J0', 'user@example.com', 'user')`);
});

// VULNÉRABILITÉ 1: Injection SQL
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Requête SQL sécurisée avec un placeholder (?)
    const query = `SELECT * FROM users WHERE username = ?`;
    
    // La variable 'username' est passée en tant que paramètre sécurisé
    db.get(query, [username], (err, user) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // VULNÉRABILITÉ 2: Mot de passe en clair dans les logs (toujours présente)
        console.log(`Login attempt for user: ${username}`);
        
        bcrypt.compare(password, user.password, async (err, result) => { // <-- Ajout de "async" ici
            if (result) {
                try {
                    const secretData = await vault.read('secret/data/app/api-keys');
                    const jwtSecret = secretData.data.data.jwt_secret;
                    const token = `simulated-jwt-signed-with-${jwtSecret}`;
                    
                    res.json({ 
                        message: 'Login successful', 
                        user: { id: user.id, username: user.username, email: user.email, role: user.role },
                        // VULNÉRABILITÉ 3: Token JWT hardcodé
                        token: token 
                    });
                    
                } catch (vaultError) {
                    console.error("Erreur lors de la récupération du secret depuis Vault:", vaultError);
                    res.status(500).json({ error: 'Could not generate session token' });
                }
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    });
});

// VULNÉRABILITÉ 4: Endpoint sans authentification exposant des données sensibles
app.get('/admin/users', isAuthenticated, (req, res) => {
    const query = 'SELECT id, username, email, role FROM users';
    db.all(query, (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(users);
    });
});

// VULNÉRABILITÉ 5: XSS via paramètre non validé
app.get('/profile/:username', (req, res) => {
    const username = req.params.username;
    const safeUsername = escapeHtml(username);
    res.send(`<h1>Profil de ${safeUsername}</h1>`);
});

// Intégration Vault - Version sécurisée
app.get('/secure/config', async (req, res) => {
    try {
        // Récupération sécurisée des secrets depuis Vault
        const secret = await vault.read('secret/data/app/database');
        const dbConfig = secret.data.data;
        
        res.json({ 
            message: 'Configuration retrieved securely',
            // Ne pas exposer les vrais secrets
            database: {
                host: dbConfig.host,
                port: dbConfig.port,
                name: dbConfig.name
                // password non exposé
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve configuration' });
    }
});

// VULNÉRABILITÉ 6: Secrets hardcodés
app.get('/secure/api-key', async (req, res) => {
    try {
        const secret = await vault.read('secret/data/app/api-keys');
        const apiKey = secret.data.data.api_key;
        res.json({ api_key: apiKey });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve API key' });
    }
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

app.listen(3000, () => {
    console.log('Vulnerable app running on port 3000');
});