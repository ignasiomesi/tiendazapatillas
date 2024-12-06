import { Component } from '@angular/core';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuarios } from 'src/app/services/usuarios';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.page.html',
  styleUrls: ['./inicio-sesion.page.scss'],
})
export class InicioSesionPage {
  nomUser: string = '';
  contra: string = '';
  usuarioLogueado: Usuarios | null = null;

  constructor(
    private bd: ServicebdService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async iniciarSesion() {
    // Vibración ligera con Haptics
    Haptics.impact({ style: HapticsImpactStyle.Light });

    try {
      await this.bd.iniciarSesion(this.nomUser, this.contra);

      // Suscribirse al observable para obtener el usuario logueado
      this.bd.obtenerUsuarioLogueado().subscribe(async (usuario: Usuarios | null) => {
        this.usuarioLogueado = usuario;

        if (usuario) {
          await this.presentToast('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/home']);
        } else {
          await this.presentToast('No se pudo obtener el usuario logueado', 'danger');
        }
      });
    } catch (error: any) {
      await this.presentToast(error.message || 'Error desconocido', 'danger');
    }
  }

  irARegistro() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/registro']);
  }

  irOlvidaContra() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/olvidacontra']);
  }

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
