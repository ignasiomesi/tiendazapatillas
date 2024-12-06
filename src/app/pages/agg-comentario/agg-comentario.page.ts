import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ServicebdService } from 'src/app/services/servicebd.service'; // Asegúrate de usar el servicio de BD
import { Usuarios } from 'src/app/services/usuarios'; // Interfaz de usuarios
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics'


@Component({
  selector: 'app-agg-comentario',
  templateUrl: './agg-comentario.page.html',
  styleUrls: ['./agg-comentario.page.scss'],
})
export class AggComentarioPage implements OnInit {
  comentario: string = ''; // Campo para el comentario
  nomUser: string = ''; // Campo para el nombre de usuario logueado

  constructor(private bd: ServicebdService,private router: Router, private toastController: ToastController) {}

  ngOnInit() {
    // Obtener el usuario logueado
    this.bd.obtenerUsuarioLogueado().subscribe((currentUser: Usuarios | null) => {
      if (currentUser) {
        this.nomUser = currentUser.nomUser; 
      } else {
        this.presentToast('Debes iniciar sesión para agregar comentarios.', 'danger');
        this.router.navigate(['/inicio-sesion']); 
      }
    });
  }

  // Método para añadir comentario
  agregarComentario() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    if (this.comentario.trim() !== '') {
      // Llamar al método insertarComentario del servicio de comentarios
      this.bd.insertarComentario(this.nomUser, this.comentario).then(() => {
        this.presentToast('Comentario añadido con éxito.', 'success');
      }).catch(err => console.error('Error al añadir comentario: ', err));
    } else {
      // Manejar caso de comentario vacío
      console.log('Comentario vacío');
    }
  }

  

    // Método para volver a la lista de comentarios
    volver() {
      this.router.navigate(['/comentarios']);
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

}
