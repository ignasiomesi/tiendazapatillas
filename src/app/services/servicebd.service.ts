import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productos } from './productos';
import { Usuarios } from './usuarios';
import { AlertController, Platform } from '@ionic/angular';
import { Comentarios } from './comentarios';

@Injectable({
  providedIn: 'root',
})
export class ServicebdService {
  // Variable de conexión a la Base de Datos
  private currentUserUsername: string | null = null;
  public database!: SQLiteObject;
  private usuarioLogueado = new BehaviorSubject<Usuarios | null>(null);
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private carrito: Productos[] = [];
  private carritoSubject: BehaviorSubject<Productos[]> = new BehaviorSubject(this.carrito);
  private listaProductos2 = new BehaviorSubject<Productos[]>([]);  
  private productoActualizadoSubject = new BehaviorSubject<boolean>(false);

  





  // Variables de creación de tablas
  private tablaProducto: string =
  'CREATE TABLE IF NOT EXISTS producto (idproducto INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50) NOT NULL, marca VARCHAR(20) NOT NULL, precio INTEGER NOT NULL, descripcion VARCHAR(50) NOT NULL, stock INTEGER NOT NULL, seccion CHAR(1) CHECK(seccion IN (\'E\', \'D\')) NOT NULL, foto TEXT NOT NULL);';

  private tablaComentarios: string =
  'CREATE TABLE IF NOT EXISTS comentarios(idcomentario INTEGER PRIMARY KEY AUTOINCREMENT, nomUser VARCHAR(50) NOT NULL, comentario VARCHAR(300) NOT NULL, baneado INTEGER DEFAULT 0);';


  private tablaUsuario: string =
  'CREATE TABLE IF NOT EXISTS usuario(idusuario INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50) NOT NULL, apellido VARCHAR(50) NOT NULL, nomUser VARCHAR(50) NOT NULL, contra VARCHAR(20) NOT NULL, codigo INTEGER NOT NULL, logueado INTEGER DEFAULT 0, foto TEXT NOT NULL);';

  
  private tablaHistorialCompras = `CREATE TABLE IF NOT EXISTS historial_compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idproducto INTEGER,
    nombre VARCHAR(100) NOT NULL,
    precio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    nomUser VARCHAR(100),
    fecha DATE,
    foto TEXT,  -- Agregando la columna foto
    FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
  );`;

  private tablaCarrito = `CREATE TABLE IF NOT EXISTS carrito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idproducto INTEGER,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    nomUser VARCHAR(100) NOT NULL,
    FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
  );`;


  // Variables de inserción por defecto
  private registroUsuario: string =
  "INSERT OR IGNORE INTO usuario (idusuario, nombre, apellido, nomUser, contra, codigo, logueado, foto) VALUES (1, 'Master', 'God', 'Admin', 'Admin123?', 9870, 0, 'https://th.bing.com/th/id/OIP.rLPJTXV1dTyD63YUsuv_kAHaHa?rs=1&pid=ImgDetMain');"; 


  private registroComentarios: string =
    "INSERT OR IGNORE INTO comentarios (idcomentario, nomUser, comentario) VALUES (1, 'Pansio', 'Me encanta la pagina');";


  // Variables tipo observables para manipular los registros de la base de datos
  private listaComentarios = new BehaviorSubject<Comentarios[]>([]);
  private listaUsuarios = new BehaviorSubject<Usuarios[]>([]);
  private usuarioLogueadoSubject = new BehaviorSubject<Usuarios | null>(null); // Almacena el usuario logueado

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.crearBD();
  }

  private crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'bdnoticias.db',
        location: 'default'
      }).then((bd: SQLiteObject) => {
        this.database = bd;
  
        // Eliminar la tabla si ya existe
        this.database.executeSql('DROP TABLE IF EXISTS usuarios', [])
          .then(() => {

            // Crear las tablas nuevamente después del DROP
            this.crearTablas();
            this.buscarProductos();
            this.buscarComentario();
            this.buscarUsuario();
            this.isDBReady.next(true);
          })
          .catch((error) => {
            console.error('Error al eliminar la tabla usuario:', error);
          });
      }).catch(e => {
        this.handleError('CrearBD', e);
      });
    }).catch(e => {
      console.error('Error al preparar la plataforma:', e);
    });
  }


  private async crearTablas() {
    try {
      await this.database.executeSql(this.tablaProducto, []);
      await this.database.executeSql(this.tablaUsuario, []);
      await this.database.executeSql(this.registroUsuario, []);
      await this.database.executeSql(this.tablaHistorialCompras, []);
      await this.database.executeSql(this.tablaCarrito, []);
      await this.database.executeSql(this.tablaComentarios, []);
      await this.database.executeSql(this.registroComentarios, []);
    } catch (e) {
      this.presentAlert('CrearTabla', 'Error: ' + JSON.stringify(e));
    }
  }

//====================
//METODOS PRODUCTOS
//====================

buscarProductos(){
  return this.database.executeSql('SELECT * FROM producto', []).then(res=>{
    let productos: Productos[] = [];
    if(res.rows.length > 0){
      for (let i = 0; i < res.rows.length; i++) {
        productos.push(res.rows.item(i));
      }
    }
    this.listaProductos2.next(productos as any);
  })

}

fetchProductos(): Observable<Productos[]>{
  return this.listaProductos2.asObservable();
}



  

  dbstate() {
    return this.isDBReady.asObservable();
  }

  
  async insertarProducto(nombre: string, marca: string, precio: number, descripcion: string, stock: number, seccion: 'E' | 'D', foto: string) {
    try {
        await this.database.executeSql(
            'INSERT INTO producto (nombre, marca, precio, descripcion, stock, seccion, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, marca, precio, descripcion, stock, seccion, foto]
        );
        this.buscarProductos();
        this.presentAlert("Agregar Producto", "Producto agregado correctamente");
    } catch (e) {
        this.handleError('Agregar Producto', e);
    }
}

getProductos(): Observable<Productos[]> {
  return this.listaProductos2.asObservable();
}




async actualizarProducto(idproducto: number, nombre: string, marca: string, precio: number, descripcion: string, stock: number, seccion: 'E' | 'D', foto: string) {
  try {
    // Realiza la actualización en la base de datos
    await this.database.executeSql(
      'UPDATE producto SET nombre = ?, marca = ?, precio = ?, descripcion = ?, stock = ?, seccion = ?, foto = ? WHERE idproducto = ?', 
      [nombre, marca, precio, descripcion, stock, seccion, foto, idproducto]
    );

    // Aquí actualizamos el BehaviorSub ject directamente, sin necesidad de llamar a buscarProductos()
    const updatedProductos = await this.obtenerProductosActualizados();
    this.listaProductos2.next(updatedProductos);  // Notificamos a los observadores inmediatamente

    this.presentAlert("Actualizar Producto", "Producto actualizado correctamente");
  } catch (e) {
    this.handleError('Actualizar Producto', e);
  }
}

// Nueva función para obtener los productos actualizados sin hacer consultas innecesarias
private async obtenerProductosActualizados(): Promise<Productos[]> {
  const res = await this.database.executeSql('SELECT * FROM producto', []);
  let productos: Productos[] = [];

  for (let i = 0; i < res.rows.length; i++) {
    productos.push(res.rows.item(i));
  }

  return productos;
}



getProductoActualizado(): Observable<boolean> {
  return this.productoActualizadoSubject.asObservable();
}

async eliminarProducto(idproducto: number) {
  try {
    // Elimina el producto de la base de datos
    await this.database.executeSql('DELETE FROM producto WHERE idproducto = ?', [idproducto]);
    this.buscarProductos();  // Llama a buscarProductos para recargar la lista
  } catch (e) {
    this.handleError('Eliminar Producto', e);
  }
}

async fetchProductoById(id: number): Promise<Productos | null> {
  try {
    const res = await this.database.executeSql('SELECT * FROM producto WHERE idproducto = ?', [id]);
    if (res.rows.length > 0) {
      return res.rows.item(0);
    }
    return null; // Retorna null si no se encuentra el producto
  } catch (e) {
    this.handleError('Obtener Producto por ID', e);
    return null;
  }
} 

//=====================
// MÉTODOS DE USUARIO
//=====================

async actualizarEstadoLogin(estado: boolean, idusuario: number | null) {
  if (estado) {
    // Si se está logueando, marcar el usuario actual
    return this.database.executeSql('UPDATE usuario SET logueado = 1 WHERE idusuario = ?', [idusuario]);
  } else {
    // Si se está deslogueando, desmarcar a todos los usuarios
    return this.database.executeSql('UPDATE usuario SET logueado = 0', []);
  }
}

obtenerUsuarioLogueado(): Observable<Usuarios | null> {
  return new Observable((observer) => {
    this.database.executeSql('SELECT * FROM usuario WHERE logueado = 1', []).then((res) => {
      if (res.rows.length > 0) {
        const usuario = {
          idusuario: res.rows.item(0).idusuario,
          nombre: res.rows.item(0).nombre,
          apellido: res.rows.item(0).apellido,
          nomUser: res.rows.item(0).nomUser,
          contra: res.rows.item(0).contra,
          codigo: res.rows.item(0).codigo,
          logueado: res.rows.item(0).logueado,
          foto: res.rows.item(0).foto,
        };
        this.actualizarUsuarioLogueado(usuario);
        observer.next(usuario);
      } else {
        observer.next(null);
      }
      observer.complete();
    }).catch((error) => {
      console.error('Error al obtener el usuario logueado:', error);
      observer.error(error);
    });
  });
}


  async getCurrentUser(): Promise<any> {
    if (!this.currentUserUsername) {
      return null;
    }
    return this.obtenerUsuarioPorNombre(this.currentUserUsername);
  }


// Método para obtener usuarios
async getUsuarios() {
  try {
    const res = await this.database.executeSql('SELECT * FROM usuario', []);
    let items: Usuarios[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          idusuario: res.rows.item(i).idusuario,
          nombre: res.rows.item(i).nombre,
          apellido: res.rows.item(i).apellido,
          nomUser: res.rows.item(i).nomUser,
          contra: res.rows.item(i).contra,
          codigo: res.rows.item(i).codigo,
          logueado: res.rows.item(i).logueado,
          foto: res.rows.item(i).foto,
        });
      }
    }
    this.listaUsuarios.next(items);
  } catch (e: unknown) {
    this.presentAlert('GetUsuarios', 'Error: ' + JSON.stringify(e));
  }
}


buscarUsuario(){
  return this.database.executeSql('SELECT * FROM usuario', []).then(res=>{
    let usuario: Usuarios[] = [];
    if(res.rows.length > 0){
      for (let i = 0; i < res.rows.length; i++) {
        usuario.push(res.rows.item(i));
      }
    }
    this.listaUsuarios.next(usuario as any);
  })
}

fetchUsuario(): Observable<Usuarios[]>{
  return this.listaUsuarios.asObservable();
}

// Método para insertar un nuevo usuario
async insertarUsuario(nomUser: string, contra: string, codigo: number, foto: string, nombre: string, apellido: string) {
  try {
    await this.database.executeSql(
      'INSERT INTO usuario (nomUser, contra, codigo, logueado, foto, nombre, apellido) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [nomUser, contra, codigo, 0, foto, nombre, apellido] // Aquí se proporcionan 7 valores, incluyendo la foto
    );
    await this.getUsuarios();
  } catch (e: unknown) {
    this.presentAlert('Insertar Usuario', 'Error: ' + JSON.stringify(e));
  }
}


// Método para modificar solo la contraseña de un usuario
async modificarUsuario(idusuario: number, nombre: string, apellido: string, nomUser: string, contra: string, foto: string) {
  try {
    await this.database.executeSql(
      'UPDATE usuario SET nombre = ?, apellido = ?, nomUser = ?, contra = ?, foto = ? WHERE idusuario = ?',
      [nombre, apellido, nomUser, contra, foto, idusuario]
    );
    console.log('Usuario modificado correctamente');
    await this.getUsuarios();
  } catch (e: unknown) {
    this.presentAlert('Modificar Usuario', 'Error: ' + JSON.stringify(e));
  }
}





cambioContra(idusuario: number, nuevaContra: string): Promise<void> {
  return this.database.executeSql('UPDATE usuario SET contra = ? WHERE idusuario = ?', [nuevaContra, idusuario])
    .then(() => {
      console.log('Contraseña actualizada correctamente');
    })
    .catch((error) => {
      console.error('Error al actualizar la contraseña', error);
      throw new Error('No se pudo actualizar la contraseña');
    });
}

  // Método auxiliar para obtener un usuario por su ID
private async obtenerUsuarioPorId(id: number): Promise<Usuarios | null> {
  try {
    const result = await this.database.executeSql('SELECT * FROM usuario WHERE idusuario = ?', [id]);
    if (result.rows.length > 0) {
      return {
        idusuario: result.rows.item(0).idusuario,
        nombre: result.rows.item(0).nombre,
        apellido: result.rows.item(0).apellido,
        nomUser: result.rows.item(0).nomUser,
        contra: result.rows.item(0).contra,
        codigo: result.rows.item(0).codigo,
        logueado: result.rows.item(0).logueado,
        foto: result.rows.item(0).foto,
      };
    }
    return null;
  } catch (e) {
    console.error('Error al obtener usuario por ID:', e);
    return null;
  }
}

  // Método modificado para eliminar un usuario y sus comentarios
  async eliminarUsuario(id: number) {
    try {
      // Primero, eliminar los comentarios asociados al usuario
      const usuario = await this.obtenerUsuarioPorId(id);
      if (usuario) {
        await this.database.executeSql('DELETE FROM comentarios WHERE nomUser = ?', [usuario.nomUser]);
      }
  
      // Luego, eliminar el usuario
      await this.database.executeSql('DELETE FROM usuario WHERE idusuario = ?', [id]);
  
      await this.getUsuarios();
      await this.getComentarios(); // Actualizar la lista de comentarios
    } catch (e: unknown) {
      this.presentAlert('Eliminar Usuario', 'Error: ' + JSON.stringify(e));
    }
  }
  


  async obtenerUsuarioPorNombre(nomUser: string) {
    const result = await this.database.executeSql('SELECT * FROM usuario WHERE nomUser = ?', [nomUser]);
    if (result.rows.length > 0) {
      return {
        idusuario: result.rows.item(0).idusuario,
        nombre: result.rows.item(0).nombre,
        apellido: result.rows.item(0).apellido,
        nomUser: result.rows.item(0).nomUser,
        contra: result.rows.item(0).contra,
        codigo: result.rows.item(0).codigo,
        logueado: result.rows.item(0).logueado,
        foto: result.rows.item(0).foto,
      };
    }
    return null;
  }
  

async iniciarSesion(nomUser: string, contra: string): Promise<void> {
  try {
    const usuario = await this.obtenerUsuarioPorNombre(nomUser);
    console.log('Usuario obtenido:', usuario);

    // Verificar que el usuario no sea null y que la contraseña coincida
    if (usuario && usuario.contra === contra) {
      await this.database.executeSql('UPDATE usuario SET logueado = 1 WHERE nomUser = ?', [nomUser]);
      this.usuarioLogueadoSubject.next(usuario); // Actualiza el usuario logueado
    } else {
      throw new Error('Usuario o contraseña incorrectos');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw new Error('Ocurrió un error al intentar iniciar sesión');
  }
}


async cerrarSesion(): Promise<void> {
  try {
    await this.database.executeSql('UPDATE usuario SET logueado = 0 WHERE logueado = 1', []);
    this.usuarioLogueado.next(null); // Actualiza el BehaviorSubject a null
    this.presentAlert('Sesión cerrada', 'Has cerrado sesión exitosamente');
  } catch (e) {
    this.presentAlert('Error al cerrar sesión', 'Ocurrió un error: ' + JSON.stringify(e));
  }
}


// Método para obtener el observable de usuario logueado
obtenerUsuarioLogueadoObservable(): Observable<Usuarios | null> {
  return this.usuarioLogueado.asObservable();
}

// Método para actualizar el usuario logueado en el observable
actualizarUsuarioLogueado(usuario: Usuarios | null) {
  this.usuarioLogueado.next(usuario);
}





  

  //=====================
  ////MÉTODOS DE CARRITO
  //=====================

  async agregarAlCarrito(producto: Productos, nomUser: string) {
    try {
      if (!nomUser) {
        throw new Error('El nombre de usuario no puede estar vacío.');
      }

      const existingProduct = await this.database.executeSql(
        'SELECT * FROM carrito WHERE idproducto = ? AND nomUser = ?',
        [producto.idproducto, nomUser]
      );

      if (existingProduct.rows.length > 0) {
        // Si ya existe, actualizamos la cantidad
        await this.database.executeSql(
          'UPDATE carrito SET cantidad = cantidad + 1 WHERE idproducto = ? AND nomUser = ?',
          [producto.idproducto, nomUser]
        );
      } else {
        // Si no existe, agregamos el nuevo producto
        await this.database.executeSql(
          'INSERT INTO carrito (idproducto, nombre, descripcion, precio, cantidad, nomUser) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [producto.idproducto, producto.nombre, producto.descripcion, producto.precio, 1, nomUser]
        );
      }

      // Actualizar la lista de productos del carrito en el observable
      this.actualizarCarritoObservable(nomUser);
    } catch (e) {
      this.handleError('Agregar al Carrito', e);
    }
  }

  async actualizarCarritoObservable(nomUser: string) {
    try {
      const result = await this.database.executeSql(
        'SELECT * FROM carrito WHERE nomUser = ?',
        [nomUser]
      );

      let items = [];
      for (let i = 0; i < result.rows.length; i++) {
        items.push(result.rows.item(i));
      }

      // Actualizar el BehaviorSubject
      this.carritoSubject.next(items);
    } catch (error) {
      console.error('Error al actualizar carrito observable:', error);
    }
  }


  // Método para obtener el carrito de un usuario
  // En ServicebdService

async obtenerCarrito(usuario: string): Promise<any[]> {
  try {
    console.log("Obteniendo carrito para el usuario:", usuario);  // Agregado para verificar qué usuario estamos utilizando
    const result = await this.database.executeSql(
      `SELECT * FROM carrito WHERE nomUser = ?`, [usuario]
    );

    let items = [];
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }

    console.log("Carrito obtenido:", items);  // Verificamos qué datos estamos obteniendo del carrito

    return items;  // Retornamos los productos del carrito
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return [];  // Si hay un error, retornamos un carrito vacío
  }
}




  // Método para eliminar un producto del carrito
  async eliminarDelCarrito(idproducto: number) {
    try {
      await this.database.executeSql('DELETE FROM carrito WHERE idproducto = ?', [idproducto]);
    } catch (e) {
      this.handleError('Eliminar del Carrito', e);
    }
  }

  // Método para vaciar el carrito
  async vaciarCarrito() {
    try {
      await this.database.executeSql('DELETE FROM carrito', []);
      console.log('Carrito vaciado correctamente');
    } catch (e) {
      this.handleError('Vaciar Carrito', e);
      throw e;
    }
  }

  // Método para realizar la compra
  async realizarCompra2(nomUser: string) {
    try {
      const productosCarrito = await this.obtenerCarrito(nomUser);

      for (const producto of productosCarrito) {
        await this.database.executeSql(
          'INSERT INTO historial_compras (idproducto, nombre, marca, precio, descripcion, stock, seccion, nomUser, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [producto.idproducto, producto.nombre, producto.marca, producto.precio, producto.descripcion, producto.stock, producto.seccion, nomUser, producto.foto]
        );
      }
      await this.vaciarCarrito();
      console.log('Compra realizada y carrito vaciado');
    } catch (e) {
      this.handleError('Realizar Compra', e);
    }
  }

  // Método para agregar un producto al carrito con cantidad seleccionada
  async agregarAlCarritoConCantidad(producto: Productos, usuario: string, cantidad: number) {
    try {
      // Paso 1: Obtener el carrito actual del usuario
      const carrito = await this.obtenerCarrito(usuario);
      const productoExistente = carrito.find(item => item.idproducto === producto.idproducto);
      
      if (productoExistente) {
        // Si el producto ya está en el carrito, solo actualizamos la cantidad
        if (productoExistente.cantidad + cantidad <= productoExistente.stock) {
          productoExistente.cantidad += cantidad;  // Actualizar la cantidad
        } else {
          throw new Error('No puedes agregar más productos que el stock disponible');
        }
      } else {
        // Si el producto no está en el carrito, lo agregamos con la cantidad seleccionada
        if (cantidad <= producto.stock) {
          carrito.push({ ...producto, cantidad });  // Agregar producto con la cantidad seleccionada
        } else {
          throw new Error('No puedes agregar más productos que el stock disponible');
        }
      }

      // Paso 2: Guardar el carrito actualizado en la base de datos
      await this.actualizarCarrito(usuario, carrito);

      // Paso 3: Actualizar el carrito en el observable
      this.carritoSubject.next(carrito);  // Actualizamos el carrito en el BehaviorSubject

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw new Error('Hubo un problema al agregar el producto al carrito');
    }
  }






  // Método auxiliar para actualizar el carrito en la base de datos
  async actualizarCarrito(usuario: string, carritoActualizado: Productos[]): Promise<void> {
    try {
      await this.database.executeSql('DELETE FROM carrito WHERE nomUser = ?', [usuario]);
      for (const producto of carritoActualizado) {
        await this.database.executeSql(
          'INSERT INTO carrito (idproducto, nombre, descripcion, precio, cantidad, nomUser) VALUES (?, ?, ?, ?, ?, ?)', 
          [producto.idproducto, producto.nombre, producto.descripcion, producto.precio, producto.cantidad, usuario]
        );
      }
    } catch (e) {
      this.handleError('Actualizar Carrito', e);
    }
  }

  async actualizarCantidadCarrito(nomUser: string, producto: Productos) {
    try {
      // Verifica si el producto ya está en el carrito
      const existingProduct = await this.database.executeSql(
        'SELECT * FROM carrito WHERE idproducto = ? AND nomUser = ?',
        [producto.idproducto, nomUser]
      );

      if (existingProduct.rows.length > 0) {
        // Si el producto ya existe en el carrito, actualizamos la cantidad
        await this.database.executeSql(
          'UPDATE carrito SET cantidad = ? WHERE idproducto = ? AND nomUser = ?',
          [producto.cantidad, producto.idproducto, nomUser]
        );
      } else {
        // Si el producto no existe, lo agregamos con la cantidad especificada
        await this.database.executeSql(
          'INSERT INTO carrito (idproducto, nombre, descripcion, precio, cantidad, nomUser) VALUES (?, ?, ?, ?, ?, ?)',
          [producto.idproducto, producto.nombre, producto.descripcion, producto.precio, producto.cantidad, nomUser]
        );
      }
    } catch (e) {
      this.handleError('Actualizar Cantidad en Carrito', e);
    }
  }



    
    //=====================
  // MÉTODOS DE Comentarios
  //=====================

  // Método para obtener los comentarios (ahora incluye el campo 'baneado')
  async getComentarios() {
    return this.database.executeSql('SELECT * FROM comentarios', []).then((res) => {
      let items: Comentarios[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            idcomentario: res.rows.item(i).idcomentario,
            nomUser: res.rows.item(i).nomUser,
            comentario: res.rows.item(i).comentario,
            baneado: res.rows.item(i).baneado || 0,  // Asignamos '0' si baneado es undefined
          });
        }
      }
      this.listaComentarios.next(items);  // Actualizamos la lista de comentarios
    });
  }
  
  

  async insertarComentario(nomUser: string, comentario: string) {
    try {
      await this.database.executeSql(
        'INSERT INTO comentarios (nomUser, comentario, baneado) VALUES (?, ?, ?)',
        [nomUser, comentario, 0]  // Aseguramos que el campo 'baneado' sea 0 por defecto
      );
      this.buscarComentario();  // Actualizamos la lista de comentarios
    } catch (e) {
      this.handleError('Agregar Comentario', e);
    }
  }
  


// Método para buscar los comentarios y actualizar la lista
buscarComentario() {
  return this.database.executeSql('SELECT * FROM comentarios', []).then(res => {
    let comentarios: Comentarios[] = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        comentarios.push({
          idcomentario: res.rows.item(i).idcomentario,
          nomUser: res.rows.item(i).nomUser,
          comentario: res.rows.item(i).comentario,
          baneado: res.rows.item(i).baneado,  // Aseguramos que 'baneado' esté actualizado
        });
      }
    }
    this.listaComentarios.next(comentarios); // Emitimos los nuevos comentarios al BehaviorSubject
  });
}


// Método para obtener los comentarios como Observable
fetchComentario(): Observable<Comentarios[]> {
  return this.listaComentarios.asObservable();
}


async banearComentario(idcomentario: number) {
  try {
    // Realiza el UPDATE en la base de datos
    await this.database.executeSql(
      'UPDATE comentarios SET baneado = 1 WHERE idcomentario = ?',
      [idcomentario]
    );

    // Llamamos a buscarComentario para actualizar la lista de comentarios
    this.buscarComentario();
  } catch (e) {
    console.error('Error al banear el comentario:', e);
  }
}

async desbanearComentario(idcomentario: number) {
  try {
    // Realiza el UPDATE para desbanear el comentario
    await this.database.executeSql(
      'UPDATE comentarios SET baneado = 0 WHERE idcomentario = ?',
      [idcomentario]
    );

    // Llamamos a buscarComentario para actualizar la lista de comentarios
    this.buscarComentario();
  } catch (e) {
    console.error('Error al desbanear el comentario:', e);
  }
}





  

   //=====================
  ////MÉTODOS DE HISTORIAL COMPRAS
  //=====================

// Método para realizar la compra y almacenar en historial

async realizarCompra(usuario: string, productos: Productos[], contra: string, codigoUsuario: string): Promise<void> {
  try {
    // Aquí puedes validar la contraseña y el código del usuario si es necesario.
    
    // Guarda cada producto en el historial de compras.
    const fecha = new Date().toISOString(); // Fecha actual
    await this.guardarCompra(usuario, productos, fecha);
    
    // Opcional: Eliminar los productos del carrito si es necesario.
    await this.eliminarCarrito(usuario); // Método que deberías implementar si es necesario.
    
  } catch (error) {
    this.handleError('Error al realizar la compra', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
}


// Método para guardar la compra en el historial
async guardarCompra(usuario: string, productos: Productos[], fecha: string): Promise<void> {
  try {
    for (const producto of productos) {
      await this.database.executeSql(
        'INSERT INTO historial_compras (idproducto, nombre, precio, cantidad, nomUser, fecha) VALUES (?, ?, ?, ?, ?, ?)',
        [producto.idproducto, producto.nombre, producto.precio, producto.cantidad, usuario, fecha]
      );
    }
  } catch (error) {
    this.handleError('Guardar Compra', error);
  }
}

async eliminarCarrito(usuario: string): Promise<void> {
  try {
    await this.database.executeSql('DELETE FROM carrito WHERE nomUser = ?', [usuario]);
  } catch (error) {
    this.handleError('Eliminar Carrito', error);
  }
}

async obtenerHistorialCompras(usuario: string): Promise<any[]> {
  try {
    const result = await this.database.executeSql(
      'SELECT * FROM historial_compras WHERE nomUser = ?',
      [usuario]
    );
    let items = [];
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }
    return items;
  } catch (error) {
    this.handleError('Obtener Historial de Compras', error);
    return [];
  }
}

async obtenerTodasLasCompras(): Promise<any[]> {
  try {
    const result = await this.database.executeSql('SELECT * FROM historial_compras', []);
    let items = [];
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }
    return items;
  } catch (error) {
    this.handleError('Obtener Todas las Compras', error);
    return [];
  }
}





  
  //=====================
  ////MÉTODOS DE UTILIDAD
  //=====================
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['OK'],
    });

    await alert.present();
  }

  private handleError(context: string, error: any) {
    console.error(`Error en ${context}:, error`);
    this.presentAlert(context, 'Error: ' + JSON.stringify(error));
  }

  dbState(): Observable<boolean> {
    return this.isDBReady.asObservable();
  }
}