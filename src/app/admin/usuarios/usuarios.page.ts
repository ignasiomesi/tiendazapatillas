import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuarios } from 'src/app/services/usuarios'; // Asegúrate de la ruta correcta
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics'
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  arregloUsuarios: Usuarios[] = [];

  constructor(private bd: ServicebdService, private router: Router, private cdr: ChangeDetectorRef, private toastController: ToastController) { }

  ngOnInit() {
    // Suscribirse al BehaviorSubject para obtener actualizaciones 
    this.bd.fetchUsuario().subscribe(Usuarios => {
        this.arregloUsuarios = Usuarios; 
    });

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.bd.getUsuarios().then(() => {
      this.bd.fetchUsuario().subscribe(usuarios => {
        this.arregloUsuarios = usuarios;
      });
    });
  }

  eliminar(usuario: Usuarios) {
    Haptics.impact({ style: HapticsImpactStyle.Light });

    // Verificamos si el usuario es el Admin antes de proceder con la eliminación
    if (usuario.nomUser === 'Admin') {
      // Si es el admin, mostramos un mensaje de advertencia
      this.presentToast('No se puede eliminar al usuario Admin.');
      return; // Salimos del método para no eliminar al usuario admin
    }

    this.bd.eliminarUsuario(usuario.idusuario).then(() => {
      // Si el usuario no es Admin, lo eliminamos y mostramos el mensaje de éxito
      this.presentToast('Usuario eliminado con éxito.');
      this.ngOnInit(); // Vuelve a cargar la lista de usuarios
      this.cdr.detectChanges();
    }).catch(err => {
      console.log('Error al eliminar usuario:', err);
    });
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
