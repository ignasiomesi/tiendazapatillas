import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  nomUser: string = '';
  contra: string = '';
  repiteContra: string = '';
  codigo: string = '';
  nombre: string = '';
  apellido: string = '';
  foto: string = ''; // Variable para la foto

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private toastController: ToastController
  ) {}

  // Función para tomar la foto
  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    console.log(image); // Verifica el contenido de image
    this.foto = image.webPath || ''; // Asegúrate de que webPath exista
  }

  // Función para registrar al usuario
  async registrarUsuario() {
    // Vibración ligera al registrar usuario
    Haptics.impact({ style: HapticsImpactStyle.Light });

    try {
      // Validación de los campos
      if (!this.nomUser.trim()) {
        throw new Error('El nombre de usuario no puede estar vacío.');
      }

      if (!this.contra.trim()) {
        throw new Error('La contraseña no puede estar vacía.');
      }

      if (this.contra.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
      }

      if (this.contra !== this.repiteContra) {
        throw new Error('Las contraseñas no coinciden.');
      }

      if (!this.codigo.trim() || !/^\d{4}$/.test(this.codigo)) {
        throw new Error('El código de seguridad debe ser un número de 4 dígitos.');
      }

      if (!this.nombre.trim()) {
        throw new Error('El nombre no puede estar vacío.');
      }

      if (!this.apellido.trim()) {
        throw new Error('El apellido no puede estar vacío.');
      }

      // Verificación de foto
      if (!this.foto) {
        throw new Error('Debes tomar una foto.');
      }

      // Guardar el usuario en la base de datos
      await this.bd.insertarUsuario(
        this.nomUser,
        this.contra,
        parseInt(this.codigo, 10),
        this.nombre,
        this.apellido,
        this.foto
      );

      await this.presentToast('Usuario registrado correctamente.', 'success');
      this.limpiarCampos();
      this.router.navigate(['/inicio-sesion']); // Redirige a la página de inicio sesión
    } catch (error: any) {
      await this.presentToast('Error: ' + error.message, 'danger');
    }
  }

  // Función para mostrar el Toast
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color,
      cssClass: 'custom-toast',
    });
    await toast.present();
  }

  // Función para limpiar los campos
  limpiarCampos() {
    this.nomUser = '';
    this.contra = '';
    this.repiteContra = '';
    this.codigo = '';
    this.nombre = '';
    this.apellido = '';
    this.foto = '';
  }
}
