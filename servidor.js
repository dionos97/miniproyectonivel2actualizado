const http = require('http');
const fs = require('fs');
const mysql = require('mysql2');
const express = require('express');
const csvParser = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

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

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
  const { id, nombre, correo } = req.body;
  connection.query(
    'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
    [nombre, correo, id],
    (err, results) => {
      if (err) {
        console.error('Error al cambiar usuario:', err);
        res.status(500).send('Error al cambiar usuario');
        return;
      }
      res.send('Usuario cambiado exitosamente');
    }
  );
});

// Ruta para importar usuarios desde un archivo CSV
app.post('/api/usuarios/import', (req, res) => {
  const csvData = []; // Almacena los datos CSV parseados

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (row) => {
      csvData.push(row);
    })
    .on('end', () => {
      connection.query('INSERT INTO usuarios (nombre, correo) VALUES ?', [csvData.map(user => [user.nombre, user.correo])], (err, results) => {
        if (err) {
          console.error('Error al importar usuarios desde un archivo CSV:', err);
          res.status(500).send('Error al importar usuarios desde un archivo CSV');
          return;
        }
        res.send('Datos CSV importados correctamente');
      });
    });
});

// Ruta para exportar usuarios a un archivo CSV
app.get('/api/usuarios/export', (req, res) => {
  connection.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios desde la base de datos:', err);
      res.status(500).send('Error al obtener usuarios desde la base de datos');
      return;
    }

    const csvWriter = createObjectCsvWriter({
      path: 'usuarios.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'nombre', title: 'Nombre' },
        { id: 'correo', title: 'Correo' }
      ]
    });

    csvWriter.writeRecords(results)
      .then(() => {
        console.log('Usuarios exportados a usuarios.csv');
        res.download('usuarios.csv'); // Descargar el archivo CSV
      })
      .catch((error) => {
        console.error('Error al escribir en el archivo CSV:', error);
        res.status(500).send('Error al exportar usuarios a un archivo CSV');
      });
  });
});

// Crear el servidor HTTP
const servidor = http.createServer(app);

// Iniciar el servidor para escuchar en el puerto especificado
servidor.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
