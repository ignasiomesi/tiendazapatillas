import { Component, OnInit,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router,NavigationEnd } from '@angular/router';
import {ChangeDetectionStrategy} from '@angular/core';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics'
import { ServicebdService } from 'src/app/services/servicebd.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class HomePage {
  userLoggedIn: boolean = false;
  
  User: string = "";
  usuarioIniciado: boolean = false; // Variable para controlar si el usuario inició sesión

  constructor(private router: Router, private activedroute: ActivatedRoute,private bd: ServicebdService ,private changeDetector: ChangeDetectorRef) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verEstado(); // Verifica el estado de login en cada cambio de navegación
      }
    });
  }

    // Método para verificar el estado de login desde la base de datos
    verEstado() {
      this.bd.obtenerUsuarioLogueado().subscribe(user => {
        this.userLoggedIn = !!user;
        this.changeDetector.markForCheck(); // Forzar la detección de cambios
      });
    }

  irAPerfil() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    localStorage.removeItem('usuario');
    this.usuarioIniciado = false; // Ocultar el botón después de cerrar sesión
    this.router.navigate(['/inicio-sesion']);
  }
    
  ngOnInit() {}
}