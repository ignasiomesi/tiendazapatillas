import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Productos } from 'src/app/services/productos';
import { ToastController, AlertController } from '@ionic/angular';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';
import { ChangeDetectorRef } from '@angular/core';  // Importar ChangeDetectorRef
import { ApiDolarService } from 'src/app/services/api-dolar.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carrito: Productos[] = [];
  totalPesos: number = 0;
  mostrarPesos: boolean = false;
  contra: string = '';
  codigo: string = '';

  constructor(private router: Router,private basededatosService: ServicebdService,private toastController: ToastController,private alertController: AlertController,private cdr: ChangeDetectorRef, private apidolar: ApiDolarService 
) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  async cargarCarrito() {
    try {
      const currentUser = await this.basededatosService.obtenerUsuarioLogueado().toPromise();
      if (currentUser?.nomUser) {
        this.carrito = await this.basededatosService.obtenerCarrito(currentUser.nomUser);
        this.calcularTotal();
        this.cdr.detectChanges(); // Forzar actualización de la vista
      } else {
        this.carrito = [];
        this.router.navigate(['/inicio-sesion']);
      }
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.presentToast('Error al cargar el carrito.');
    }
  }

  async convertirADolares(totalDolares: number) {
    try {
      const valorDolar = await firstValueFrom(this.apidolar.getDollarValue());
      this.totalPesos = totalDolares * valorDolar;
    } catch (error) {
      console.error('Error al obtener el valor del dólar:', error);
      this.presentToast('No se pudo obtener el valor del dólar.');
    }
  }

  toggleTotal() {
    this.mostrarPesos = !this.mostrarPesos;
  }

  get totalDisplay() {
    const totalDolares = this.carrito.reduce((acc, producto) => {
      const precio = producto.precio || 0;
      const cantidad = producto.cantidad || 0;
      return acc + (precio * cantidad);
    }, 0);
    
    return this.mostrarPesos ? this.totalPesos : totalDolares;
  }
  

  async eliminarDelCarrito(producto: Productos) {
    try {
      const currentUser = await this.basededatosService.obtenerUsuarioLogueado().toPromise();
      if (currentUser && currentUser.nomUser) {
        await this.basededatosService.eliminarDelCarrito(producto.idproducto);
        this.cargarCarrito(); // Recargar el carrito
        this.presentToast('Producto eliminado del carrito');
      } else {
        this.router.navigate(['/iniciar-sesion']);
      }
    } catch (e) {
      console.error('Error al eliminar producto del carrito:', e);
      this.presentToast('Error al eliminar producto del carrito');
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

  async calcularTotal() {
    const totalDolares = this.carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    this.totalPesos = totalDolares * 800;

    // Verifica si el total es 0
    if (this.totalPesos === 0) {
      this.presentToast('No hay productos en el carrito.');
    }
  }
  async realizarCompra() {
    try {
      await Haptics.impact({ style: HapticsImpactStyle.Light });
      // Validar datos del formulario
      if (this.totalPesos === 0) {
        this.presentToast('No puedes comprar porque no hay productos en el carrito.');
        return;
      }

      if (!this.contra || !this.codigo) {
        this.presentToast('Por favor, completa todos los campos.');
        return;
      }

      if (!/^\d{4}$/.test(this.codigo)) {
        this.presentToast('El codigo debe ser de 4 digitos');
        return;
      }

      const currentUser = await this.basededatosService.obtenerUsuarioLogueado().toPromise();

      if (currentUser) {
        if (currentUser.codigo === Number(this.codigo) && currentUser.contra === this.contra) {
          await this.basededatosService.realizarCompra(currentUser.nomUser, this.carrito, this.contra, this.codigo);
          this.presentToast('Compra realizada con éxito.');
          this.router.navigate(['/perfil']);
        } else {
          this.presentToast('Uno de los datos es incorrecto.');
        }
      } else {
        this.router.navigate(['/iniciar-sesion']);
      }
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      this.presentToast('Error al realizar la compra.');
    }
  }

  async presentAlert(producto: Productos) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de que deseas eliminar ${producto.nombre} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarDelCarrito(producto);
          }
        }
      ]
    });

    await alert.present();
  }
}
