import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-olvidacontra',
  templateUrl: './olvidacontra.page.html',
  styleUrls: ['./olvidacontra.page.scss'],
})
export class OlvidacontraPage implements OnInit {
  formularioCambio!: FormGroup;

  constructor(
    public fb: FormBuilder,
    private toastController: ToastController,
    private bd: ServicebdService
  ) {}

  ngOnInit() {
    // Inicializa el formulario en el método ngOnInit
    this.formularioCambio = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      contra: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Método para cambiar la contraseña
  async cambiar() {
    const nombre = this.formularioCambio.get('nombre')?.value;
    const codigo = this.formularioCambio.get('codigo')?.value;
    const nuevaContra = this.formularioCambio.get('contra')?.value;
  
    // Verificar si el usuario existe en la base de datos
    const usuario = await this.bd.obtenerUsuarioPorNombre(nombre);
  
    if (usuario && usuario.codigo === codigo) {
      // Validar que la nueva contraseña tenga al menos 8 caracteres
      if (nuevaContra.length < 8) {
        await this.presentToast('La nueva contraseña debe tener como mínimo 8 carácteres', 'danger');
        return;
      }
  
      // Validar que la nueva contraseña contenga al menos un carácter especial
      const caracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;
      if (!caracterEspecial.test(nuevaContra)) {
        await this.presentToast('La nueva contraseña debe tener como mínimo 1 carácter especial', 'danger');
        return;
      }
  
      // Validar que la nueva contraseña contenga al menos una letra mayúscula
      const mayuscula = /[A-Z]/;
      if (!mayuscula.test(nuevaContra)) {
        await this.presentToast('La nueva contraseña debe tener como mínimo 1 una letra mayúscula', 'danger');
        return;
      }
  
      // Si las validaciones son correctas, actualiza la contraseña
      try {
        await this.bd.cambioContra(usuario.idusuario, nuevaContra); // Llamada a la función modificarUsuario
        await this.presentToast('La contraseña ha sido modificada correctamente', 'success');
      } catch (error) {
        console.error('Error al modificar la contraseña', error);
        await this.presentToast('Hubo un error al modificar la contraseña', 'danger');
      }
    } else {
      // Si no coinciden, muestra un mensaje de error
      await this.presentToast('Usuario o código incorrecto', 'danger');
    }
  }
  

  // Alerta para mostrar mensajes
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración del Toast
      position: 'top', // Mostrar en la parte superior
      color: color, // Color de éxito o error
      cssClass: 'custom-toast', // Clase personalizada (opcional)
    });

    await toast.present();
  }
}
