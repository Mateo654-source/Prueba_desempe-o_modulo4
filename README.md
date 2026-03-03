### InspectaPro Backend
## REST API — Node.js + MySQL + MongoDB
## -Arquitectura Híbrida SQL + NoSQL
## Descripción General
    InspectaPro es una API REST construida sobre Node.js + Express que gestiona clientes, transacciones y proveedores. Utiliza una arquitectura híbrida:

    • MySQL (SQL) — datos estructurales y relacionales: clientes, productos, proveedores.

    • MongoDB (NoSQL) — datos dinámicos y de auditoría: transacciones, logs de cambios.

    • JWT — autenticación stateless con roles embebidos en el token.

Tecnologías:
Node.js
Express
Framework HTTP
MySQL2
Base de datos relacional
Mongoose
ODM para MongoDB
bcryptjs
jsonwebtoken
Autenticación JWT

Instalación
1. Instalar dependencias:
  npm init -y
  npm install express
  npm install dotenv
  npm install jsonwebtoken
  npm install bcryptjs
  npm install mongoose
  npm install mysql2
  npm install cors
  npm install multer
  npm install path
  npm install csv-parse
 
2. Configurar variables de entorno en el archivo .env:
  DB_HOST=...       DB_PORT=...
  DB_USER=...       DB_PASSWORD=...     DB_NAME=...
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=supersecretkey   JWT_EXPIRES_IN=1h

3. Iniciar el servidor:
  npm start

El servidor arranca en http://localhost:3000 y verifica ambas conexiones al iniciar.

## Endpoints de la API
//Usuarios
router.post('/users/register', authRoutes); Para registrar usuarios.
router.post('/users/login', authRoutes); Para loguear usuarios.
/Transacciones
router.get('/', authenticate, getTransactions); Obtener transacciones.
router.post('/', authenticate, createTransaction); Crear transaccion.
/Usuarios
router.get('/', authenticate, getUsers); Obtener usuarios.
router.put('/:id', authenticate, updateCustomer); Actualizar usuarios.
/Proveedores
router.get('/', authenticate, getSuppliers); Obtener proveedores.
router.post('/create', authenticate, createSuplier) Crear proveedor.
router.put('/:id', authenticate, updateSupplier); Actualizar proveedores.
 
## Modelos de Datos

SQL (MySQL)
-------
customers:
id, customer_name, email_contact, c_password, phone, address
Contraseña hasheada con bcrypt
products:
id, product_name, price, quantity
Inventario con stock
suppliers:
id, supplier_name, email_contact
Proveedores actualizables
-------
NoSQL (MongoDB — Mongoose)
transactions:
transaction_id, customer_id, products{}, date, created_by
Registro de ventas/movimientos
logs:
transaction_id, customer_id, products{}, action, changed_by
Auditoría de transacciones
logsuppliers:
supplier_id, changed_by, old_data{}, new_data{}, note
Auditoría de cambios en proveedores

Roles y Autorización

  ⚠  Nota importante sobre roles
El sistema reconoce dos roles: USER y ADMIN. El middleware de authorize() lee los roles del payload del JWT. Sin embargo, actualmente todos los usuarios registrados reciben el rol USER por defecto.

Para promover un usuario a ADMIN se requiere uno de los siguientes enfoques:

    • Agregar una columna role a la tabla customers y leerla en el login.
    • Crear una tabla roles y una tabla intermedia customer_roles (N:M normalizado).
    • Asignar roles manualmente en la base de datos hasta implementar el endpoint de gestión de roles.


Estructura del Proyecto
  backend/
  ├── config/
  │   ├── db.js              # Pool de conexión MySQL
  │   └── mongo.js           # Conexión Mongoose
  ├── controllers/
  │   ├── csvController.js 
  │   ├── logsController.js 
  │   ├── authController.js 
  │   ├── userController.js  
  │   ├── transactionController.js
  │   └── supplierController.js
  ├── middlewares/
  │   └── auth.js            
  ├── models/
  │   ├── LogTransaction.js  # Mongoose schema (auditoría TX)
  │   ├── Transaction.js     # Mongoose schema
  │   ├── LogUser.js  
  │   └── LogSupplier.js     # Mongoose schema (auditoría proveedores)
  ├── routes/
  │   ├── auth.js
  │   ├── csv.js
  │   ├── users.js
  │   ├── transactions.js
  │   └── suppliers.js
  ├── .env
  ├── package.json
  └── server.js