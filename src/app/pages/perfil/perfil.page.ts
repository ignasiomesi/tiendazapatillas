import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuarios } from 'src/app/services/usuarios';
import { Subscription } from 'rxjs';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {
  usuario: Usuarios | null = null;
  isLoggedIn: boolean = false;
  private subscription: Subscription | null = null;

  constructor(public router: Router, private bd: ServicebdService) {}

  ngOnInit() {
    this.checkUserLogin();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  async irHistorial() {
    this.router.navigate(['/historial-usuario']);
  }

  modificar() {
    this.router.navigate(['/modperfil']);
  }

  mostrarCodigo(): string {
    if (this.usuario && this.usuario.codigo !== undefined && this.usuario.codigo !== null) {
      return this.usuario.codigo.toString().padStart(4, '0');
    }
    return 'No disponible';
  }


  checkUserLogin() {
    this.subscription = this.bd.obtenerUsuarioLogueadoObservable().subscribe(
      (usuario: Usuarios | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.isLoggedIn = true;
          console.log('Foto de usuario:', this.usuario.foto); // Esto debe mostrar la URL de la imagen
        } else {
          this.isLoggedIn = false;
          this.usuario = null;
          this.router.navigate(['/inicio-sesion']);
        }
      },
      (error) => {
        console.error('Error al obtener el usuario logueado:', error);
        this.isLoggedIn = false;
        this.usuario = null;
        this.router.navigate(['/inicio-sesion']);
      }
    );
  }

  onImageError(event: any) {
    console.error('Error cargando la imagen:', event);
    event.target.src = 'https://th.bing.com/th/id/R.910d743c758bd4103ff3528586fbb77f?rik=zDGAvxW1zCJGgQ&pid=ImgRaw&r=0'; // Imagen por defecto
  }
  
  
  
}
