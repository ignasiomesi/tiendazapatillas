import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {

  productoM: any = { idproducto: 0, nombre: '', marca:'', precio: 0 , descripcion: '', stock: 0, seccion:'', foto: '' };
  selectedFile: File | null = null;

  constructor(
    private toastController: ToastController,
    private servicio: ServicebdService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const idproducto = Number(this.route.snapshot.paramMap.get('id'));
    this.productoM = await this.servicio.fetchProductoById(idproducto);
    console.log(this.productoM);  // Verifica el producto cargado
    if (!this.productoM) {
      await this.presentToast('No se pudo encontrar el producto.', 'danger');
      this.router.navigate(['/listar']);
    }
  }

  async editar() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    if (this.productoM) {
      // Subir la imagen seleccionada si existe
      const fotoUrl = this.selectedFile ? await this.uploadImage(this.selectedFile) : this.productoM.foto;

      await this.servicio.actualizarProducto(
        this.productoM.idproducto,
        this.productoM.nombre,
        this.productoM.marca,
        this.productoM.precio,
        this.productoM.descripcion,
        this.productoM.stock,
        this.productoM.seccion,
        fotoUrl
      );
      await this.presentToast('Producto actualizado correctamente.', 'success');
      this.router.navigate(['/listar']); // Redirige después de guardar
    } else {
      await this.presentToast('No se pudo encontrar el producto.', 'danger');
    }
  }

  // Manejar la selección de archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Seleccionar una foto desde la galería
  async seleccionarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,  // Permite elegir entre cámara o galería
        resultType: CameraResultType.DataUrl, // Devuelve la imagen en formato Data URL
      });
      this.productoM.foto = image.dataUrl; // Asigna la imagen seleccionada a la propiedad foto
      this.cdr.detectChanges(); // Forzar actualización de la vista
    } catch (error) {
      console.error('Error seleccionando foto', error);
      await this.presentToast('No se pudo seleccionar la foto.', 'danger');
    }
  }

  // Tomar una foto con la cámara
  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera, // Abre directamente la cámara
        resultType: CameraResultType.DataUrl, // Devuelve la imagen en formato Data URL
      });
      this.productoM.foto = image.dataUrl; // Asigna la imagen tomada a la propiedad foto
      this.cdr.detectChanges(); // Forzar actualización de la vista
    } catch (error) {
      console.error('Error tomando foto', error);
      await this.presentToast('No se pudo tomar la foto.', 'danger');
    }
  }

  // Función para subir la imagen (simulación de subida)
  async uploadImage(file: File): Promise<string> {
    // Aquí deberías implementar la lógica para subir la imagen al servidor
    console.log('Subiendo archivo:', file);
    return 'url_de_la_imagen'; // Retorna una URL simulada
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
