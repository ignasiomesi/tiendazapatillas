import { ChangeDetectorRef, Component } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuarios } from './services/usuarios';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics'


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
  export class AppComponent {
    userLoggedIn: boolean = false;
    isAdminUser: boolean = false;

    constructor(private router: Router,private bd: ServicebdService,private changeDetector: ChangeDetectorRef) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.verEstado(); // Verifica el estado de login en cada cambio de navegación
        }
      });
    }

    ngOnInit() {
    }

  // Método para verificar el estado de login desde la base de datos
  verEstado() {
    this.bd.obtenerUsuarioLogueado().subscribe(user => {
      this.userLoggedIn = !!user;
      if (user) {
        this.isAdminUser = user.nomUser === 'Admin';
      } else {
        this.isAdminUser = false;
      }
      this.changeDetector.markForCheck(); // Forzar la detección de cambios
    });
  }

  cerrarSesion() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.bd.obtenerUsuarioLogueado().subscribe((user: Usuarios | null) => {
      if (user) {
        // Actualizar el estado de login en la base de datos
        this.bd.actualizarEstadoLogin(false, user.idusuario).then(() => {
          this.userLoggedIn = false; // Actualiza el estado
          console.log('Sesión cerrada'); // Log para verificar
          this.router.navigate(['/inicio-sesion']); // Redirige a la página de inicio de sesión
        });
      }
    });
  }
}
