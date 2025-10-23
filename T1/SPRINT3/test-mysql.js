const mysql = require('mysql2/promise');

async function testConnection() {
    const configs = [
        { host: 'localhost', port: 3306, user: 'root', password: '', database: 'guildmanagement' },
        { host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'guildmanagement' },
        { host: 'localhost', port: 3306, user: 'root', password: '', database: 'guildmanagement', connectTimeout: 10000 },
        { host: '127.0.0.1', port: 3306, user: 'root', password: '', database: 'guildmanagement', connectTimeout: 10000 }
    ];
    
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        try {
            console.log(`🔍 Probando configuración ${i + 1}:`, config.host);
            const connection = await mysql.createConnection(config);
            console.log('✅ Conectado exitosamente!');
            await connection.execute('SELECT 1 as test');
            console.log('✅ Consulta exitosa!');
            await connection.end();
            return true;
        } catch (error) {
            console.log(`❌ Configuración ${i + 1} falló:`, error.message);
        }
    }
    return false;
}

testConnection().then(success => {
    if (success) {
        console.log('🎉 ¡MySQL funciona con Node.js!');
    } else {
        console.log('❌ MySQL no funciona con Node.js');
    }
    process.exit(0);
});
