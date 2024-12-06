import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Productos } from 'src/app/services/productos';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {
  arregloProductos: any;

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Suscribirse al BehaviorSubject para obtener actualizaciones
    this.bd.fetchProductos().subscribe((productos) => {
      this.arregloProductos = productos; // Actualiza la lista de productos en tu componente
      console.log(this.arregloProductos); // Verifica los productos cargados
    });
  }

  modificar(producto: Productos) {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/modificar', { id: producto.idproducto }]);
  }

  async eliminar(producto: Productos) {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    try {
      // Llamamos al método de eliminar el producto
      await this.bd.eliminarProducto(producto.idproducto);

      // Mostramos un toast con el mensaje de éxito
      this.presentToast('Producto eliminado con éxito, porfavor actualice la página.');

      // Forzar la detección de cambios para que la vista se actualice
      this.cdr.detectChanges(); // Detecta los cambios manualmente
    } catch (err) {
      console.log('Error al eliminar el producto:', err);
    }
  }

  irpagina() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/agregar']);
  }

  onImageError(event: any) {
    console.error('Error cargando la imagen:', event);
    event.target.src =
      'https://th.bing.com/th/id/R.910d743c758bd4103ff3528586fbb77f?rik=zDGAvxW1zCJGgQ&pid=ImgRaw&r=0'; // Imagen por defecto
  }

  // Método para mostrar el toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  actualizarCambios() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/listar']);
  }
}
