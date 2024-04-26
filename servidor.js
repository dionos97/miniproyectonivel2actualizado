const http = require('http');
const fs = require('fs');
const mysql = require('mysql2');
const express = require('express');

const PORT = process.env.PORT || 3000;

const app = express();

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'dionos97',
  user: 'dionos97', 
  password: '123d', 
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

// Ruta para obtener todos los usuarios desde la base de datos
app.get('/api/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios desde la base de datos:', err);
      res.status(500).json({ error: 'Error al obtener usuarios desde la base de datos' });
      return;
    }
    // Devolver los usuarios en formato JSON
    res.json(results);
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
