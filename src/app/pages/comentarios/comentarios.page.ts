import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';
import { Usuarios } from 'src/app/services/usuarios';
import { Haptics, HapticsImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.page.html',
  styleUrls: ['./comentarios.page.scss'],
})
export class ComentariosPage implements OnInit {
  arregloComentarios: any;
  currentUser: Usuarios | null = null;  // Guardar el usuario actual para verificar si es admin

  constructor(private router: Router, private bd: ServicebdService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // Nos suscribimos al Observable de comentarios para recibir actualizaciones automáticas
    this.bd.fetchComentario().subscribe(comentarios => {
      console.log('Comentarios actualizados:', comentarios);
      this.arregloComentarios = comentarios;
    });
  
    // Obtener el usuario logueado
    this.bd.obtenerUsuarioLogueado().subscribe((user: Usuarios | null) => {
      console.log('Usuario logueado:', user);
      this.currentUser = user;
    });
  }
  
  
  

  // Método para banear un comentario
  banearComentario(idcomentario: number) {
    console.log('Usuario logueado:', this.currentUser?.nomUser);  // Verifica el valor de nomUser
    if (this.currentUser?.nomUser === 'Admin') {
      this.bd.banearComentario(idcomentario);
      this.cdr.detectChanges();

    }
  }
  

  // Método para verificar si un comentario está baneado
  isComentarioVisible(comentario: any): boolean {
    return comentario.baneado === 0 || this.currentUser?.nomUser === 'Admin';
  }

  irPaginaAgregar() {
    Haptics.impact({ style: HapticsImpactStyle.Light });
    this.bd.obtenerUsuarioLogueado().subscribe((currentUser: Usuarios | null) => {
      if (currentUser) {
        this.router.navigate(['/agg-comentario']);
      } else {
        this.router.navigate(['/inicio-sesion']);
      }
    });
  }

  // Método para desbanear un comentario
desbanearComentario(idcomentario: number) {
  console.log('Usuario logueado:', this.currentUser?.nomUser);  // Verifica el valor de nomUser
  if (this.currentUser?.nomUser === 'Admin') {
    this.bd.desbanearComentario(idcomentario);
    this.cdr.detectChanges();
  }
}

}
