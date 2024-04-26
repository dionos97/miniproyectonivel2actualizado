const http = require('http');
const fs = require('fs');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', 
  password: '', 
  database: 'miniproyectonivel2'   
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Ruta para obtener todos los usuarios desde la base de datos y mostrarlos en la página
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios desde la base de datos:', err);
      res.status(500).send('Error al obtener usuarios desde la base de datos');
      return;
    }
    // Renderizar una plantilla de página HTML con los datos de los usuarios
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lista de Usuarios</title>
      </head>
      <body>
        <h1>Lista de Usuarios</h1>
        <ul>
          ${results.map(user => `<li>${user.nombre}: ${user.correo}</li>`).join('')}
        </ul>
      </body>
      </html>
    `);
  });
});

// Ruta para cambiar usuario
app.post('/cambiar-usuario', (req, res) => {
  // Agregar la lógica necesaria para cambiar el usuario, según los requisitos del proyecto
  res.send('Lógica para cambiar usuario');
});

// Ruta para importar usuarios desde un archivo
app.post('/api/usuarios/import', (req, res) => {
  // Agregar la lógica necesaria para importar usuarios desde un archivo a la base de datos
  res.send('Lógica para importar usuarios desde un archivo');
});

// Ruta para exportar usuarios a un archivo
app.get('/api/usuarios/export', (req, res) => {
  // Agregar la lógica necesaria para exportar usuarios desde la base de datos a un archivo
  res.send('Lógica para exportar usuarios a un archivo');
});

// Crear el servidor HTTP
const servidor = http.createServer(app);

// Iniciar el servidor para escuchar en el puerto especificado
servidor.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
