const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Obtener la ruta solicitada
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Extensión del archivo
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    // Mapear extensiones a tipos MIME
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    // Leer y servir el archivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Página no encontrada
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end('Error del servidor: ' + error.code);
            }
        } else {
            // Archivo encontrado
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*' // Permite CORS
            });
            res.end(content, 'utf-8');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}/`);
    console.log(`Abre tu navegador y ve a: http://localhost:3000/formulario.html`);
});