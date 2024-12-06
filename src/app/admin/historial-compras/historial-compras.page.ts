import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.page.html',
  styleUrls: ['./historial-compras.page.scss'],
})
export class HistorialComprasPage implements OnInit {
  historialCompras: any[] = []; // Arreglo para almacenar el historial de compras
  totalCompras: number = 0; // Variable para almacenar el total de las compras

  constructor(private service: ServicebdService, private router: Router, private toastController: ToastController) {}

  ngOnInit() {
    this.cargarHistorialCompras(); // Carga el historial de compras al iniciar
  }

  async cargarHistorialCompras() {
    this.historialCompras = await this.service.obtenerTodasLasCompras();
    this.calcularTotal(); // Calcula el total de las compras después de cargar el historial
  }

  calcularTotal() {
    this.totalCompras = this.historialCompras.reduce((total, compra) => total + (compra.precio * compra.cantidad), 0);
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000, // Duración del Toast en milisegundos
      position: 'top', // Posición del Toast en la parte superior
      color, // Color según el tipo de mensaje
      cssClass: 'custom-toast', // Clase CSS opcional para personalización
    });
    await toast.present();
  }
}
