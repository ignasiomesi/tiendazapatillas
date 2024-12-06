import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Productos } from 'src/app/services/productos';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-zapatillas',
  templateUrl: './zapatillas.page.html',
  styleUrls: ['./zapatillas.page.scss'],
})
export class ZapatillasPage implements OnInit {
  arregloProductos: Productos[] = [];
  cantidadSeleccionada: number = 1; // Variable para manejar la cantidad seleccionada en la interfaz

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Suscribirse al BehaviorSubject para obtener actualizaciones
     
    this.bd.fetchProductos().subscribe(productos => {
      this.arregloProductos = productos; // Actualiza la lista de productos en tu componente
    });    
  }


  async agregarAlCarrito(producto: Productos) {
    try {
      // Obtenemos el usuario logueado
      const currentUser = await firstValueFrom(this.bd.obtenerUsuarioLogueado());
    
      if (currentUser) {
        console.log('Intentando agregar al carrito...');
  
        // Asegurarnos de que la cantidad seleccionada sea un número entero
        if (!Number.isInteger(this.cantidadSeleccionada)) {
          this.presentToast('Por favor, ingrese solo números enteros para la cantidad');
          return;
        }
    
        // Obtenemos el carrito actual del usuario
        const carritoActual = await this.bd.obtenerCarrito(currentUser.nomUser);
    
        // Verificamos si la cantidad seleccionada es mayor que 0
        if (this.cantidadSeleccionada <= 0) {
          this.presentToast('La cantidad seleccionada es inválida');
          return;
        }
    
        // Asegurarnos de que la cantidad seleccionada no exceda el stock
        if (this.cantidadSeleccionada > producto.stock) {
          this.presentToast('La cantidad seleccionada excede el stock disponible');
          return;
        }
    
        // Verificamos si el producto ya está en el carrito
        const productoEnCarrito = carritoActual.find(p => p.idproducto === producto.idproducto);
    
        if (productoEnCarrito) {
          // Si ya está en el carrito, actualizamos la cantidad sumando la cantidad seleccionada
          const nuevaCantidad = productoEnCarrito.cantidad + this.cantidadSeleccionada;
    
          // Verificamos si la nueva cantidad excede el stock disponible
          if (nuevaCantidad > producto.stock) {
            this.presentToast('La cantidad seleccionada excede el stock disponible');
            return;
          }
    
          // Actualizamos el producto en el carrito
          productoEnCarrito.cantidad = nuevaCantidad;
          await this.bd.actualizarCantidadCarrito(currentUser.nomUser, productoEnCarrito);
    
          this.presentToast('Cantidad actualizada en el carrito');
        } else {
          // Si el producto no está en el carrito, lo agregamos con la cantidad seleccionada
          await this.bd.agregarAlCarritoConCantidad(producto, currentUser.nomUser, this.cantidadSeleccionada);
    
          this.presentToast('Producto agregado al carrito');
        }
      } else {
        // Si no hay usuario logueado, mostramos un mensaje y redirigimos
        this.presentToast('Debes iniciar sesión para agregar productos');
        this.router.navigate(['/inicio-sesion']);
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      this.presentToast('Hubo un problema al agregar el producto al carrito');
    }
  }
  
  

  async presentToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}