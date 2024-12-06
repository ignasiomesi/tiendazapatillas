import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Productos } from 'src/app/services/productos';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-historial-usuario',
  templateUrl: './historial-usuario.page.html',
  styleUrls: ['./historial-usuario.page.scss'],
})
export class HistorialUsuarioPage implements OnInit {
  historialCompras: any[] = []; // Para almacenar el historial de compras del usuario

  constructor(
    private router: Router,
    private service: ServicebdService,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarHistorialCompras();
  }

  async cargarHistorialCompras() {
    const currentUser = await this.service.obtenerUsuarioLogueado().toPromise();
    if (currentUser && currentUser.nomUser) {
      this.historialCompras = await this.service.obtenerHistorialCompras(currentUser.nomUser);
      this.cdr.detectChanges();
    } else {
      this.router.navigate(['/iniciar-sesion']); // Redirigir si no está logueado
    }
  }


  async presentToast(message: string, color: 'success' | 'danger' | 'medium') {
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
