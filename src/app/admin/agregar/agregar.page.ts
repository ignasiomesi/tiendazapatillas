import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, ToastController } from '@ionic/angular';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics'



@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  nombre: string = '';
  marca: string = '';
  precio: number = 0;
  descripcion: string = '';
  stock: number = 0;
  seccion: string = '';
  foto: string = '';

  constructor(private bd: ServicebdService, private router: Router,private toastController: ToastController) {}


  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
  
    console.log(image); // Verifica el contenido de image
    this.foto = image.webPath || ''; // Asegúrate de que webPath exista
  }

  ngOnInit() {}


  async crear() {
    // Vibración ligera al crear un producto
    Haptics.impact({ style: HapticsImpactStyle.Light });

    try {

      // Validación del nombre
      if (!this.nombre.trim()) {
          throw new Error('El nombre no puede estar vacío.');
        }

      // Validación de la marca
      if (!this.marca.trim()) {
          throw new Error('La marca no puede estar vacía.');
        }

      // Validación de la descripción
      if (!this.descripcion.trim()) {
          throw new Error('La descripción no puede estar vacía.');
        }


      // Validación de la sección
      if (this.seccion !== 'E' && this.seccion !== 'D') {
        throw new Error("La sección debe ser 'E' o 'D'.");
      }

      // Validación del precio y stock
      if (this.precio === 0 || this.stock === 0) {
        throw new Error('El precio o stock no pueden ser 0.');
      }
      if (/^0\d+/.test(this.precio?.toString()) || /^0\d+/.test(this.stock?.toString())) {
        throw new Error('No puedes poner un 0 antes en precio o stock.');
      }

      console.log('Foto a guardar:', this.foto); // Verificación de la ruta de la foto

      // Inserción del producto en la base de datos
      await this.bd.insertarProducto(
        this.nombre,
        this.marca,
        this.precio!,
        this.descripcion,
        this.stock!,
        this.seccion,
        this.foto
      );

      await this.presentToast('Producto agregado correctamente.', 'success');
      this.limpiarCampos();
    } catch (error: any) {
      await this.presentToast('Error: ' + error.message, 'danger');
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
  
  

  limpiarCampos() {
    this.nombre = '';
    this.marca = '';
    this.precio = 0;
    this.descripcion = '';
    this.stock = 0;
    this.seccion = '';
  }

  
  

  
}
