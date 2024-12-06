import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';
import { Usuarios } from 'src/app/services/usuarios';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-modperfil',
  templateUrl: './modperfil.page.html',
  styleUrls: ['./modperfil.page.scss'],
})
export class ModperfilPage implements OnInit {
  formularioPerfil!: FormGroup;
  usuarioLogueado: Usuarios | null = null; // Variable para almacenar el usuario logueado

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private bd: ServicebdService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Inicializa el formulario
    this.formularioPerfil = this.fb.group({
      nuevaContra: ['', [Validators.minLength(8)]],
      repiteContra: ['', [Validators.minLength(8)]],
    });

    // Obtener el usuario logueado desde la base de datos
    this.bd.obtenerUsuarioLogueado().subscribe(usuario => {
      if (usuario) {
        this.usuarioLogueado = usuario; // Guardar el usuario logueado
        // Rellenar el formulario con el nombre de usuario logueado
        this.formularioPerfil.patchValue({
          nomUser: usuario.nomUser,
        });
      }
    });
  }

  // Método para modificar el perfil del usuario
  async modificarPerfil() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    const { nuevaContra, repiteContra } = this.formularioPerfil.value;

    if (!this.usuarioLogueado) {
      await this.presentToast('No hay usuario logeado', 'danger');
      return;
    }

    try {
      // Verificar que las contraseñas coincidan
      if (nuevaContra !== repiteContra) {
        await this.presentToast('Las contraseñas no coinciden', 'danger');
        return;
      }

      // Realizar las validaciones de la contraseña
      if (nuevaContra && nuevaContra.length < 8) {
        await this.presentToast('La nueva contraseña debe tener mínimo 8 caracteres', 'danger');
        return;
      }

      const caracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;
      if (!caracterEspecial.test(nuevaContra)) {
        await this.presentToast('La nueva contraseña debe como mínimo 1 carácter especial', 'danger');
        return;
      }

      const mayuscula = /[A-Z]/;
      if (!mayuscula.test(nuevaContra)) {
        await this.presentToast('La nueva contraseña debe tener como mínimo 1 mayúscula', 'danger');
        return;
      }

      // Si pasa las validaciones, actualizar el perfil del usuario
      await this.bd.modificarUsuario(
        this.usuarioLogueado.idusuario,  // ID del usuario
        this.usuarioLogueado.nombre,     // Nombre
        this.usuarioLogueado.apellido,   // Apellido
        this.usuarioLogueado.nomUser,    // Nombre de usuario
        nuevaContra,                     // Nueva contraseña
        this.usuarioLogueado.foto        // Foto
      );

      await this.presentToast('Perfil actualizado correctamente', 'success');
      this.router.navigate(['/perfil']); // Redirige al perfil después de la modificación
    } catch (error) {
      console.error('Error al modificar el perfil:', error);
      await this.presentToast('Hubo un error al modificar el perfil', 'danger');
    }
  }

  // Método para mostrar alertas
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
