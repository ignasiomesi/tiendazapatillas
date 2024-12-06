import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./pages/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'agregar',
    loadChildren: () => import('./admin/agregar/agregar.module').then( m => m.AgregarPageModule)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./admin/modificar/modificar.module').then( m => m.ModificarPageModule)
  },
  {
    path: 'listar',
    loadChildren: () => import('./admin/listar/listar.module').then( m => m.ListarPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'inicio-sesion',
    loadChildren: () => import('./pages/inicio-sesion/inicio-sesion.module').then( m => m.InicioSesionPageModule)
  },
  {
    path: 'modperfil',
    loadChildren: () => import('./pages/modperfil/modperfil.module').then( m => m.ModperfilPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./admin/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'comentarios',
    loadChildren: () => import('./pages/comentarios/comentarios.module').then( m => m.ComentariosPageModule)
  },
  {
    path: 'agg-comentario',
    loadChildren: () => import('./pages/agg-comentario/agg-comentario.module').then( m => m.AggComentarioPageModule)
  },
  {
    path: 'zapatillas',
    loadChildren: () => import('./pages/zapatillas/zapatillas.module').then( m => m.ZapatillasPageModule)
  },
  {
    path: 'historial-usuario',
    loadChildren: () => import('./pages/historial-usuario/historial-usuario.module').then( m => m.HistorialUsuarioPageModule)
  },
  {
    path: 'historial-compras',
    loadChildren: () => import('./admin/historial-compras/historial-compras.module').then( m => m.HistorialComprasPageModule)
  },
  {
    path: 'olvidacontra',
    loadChildren: () => import('./pages/olvidacontra/olvidacontra.module').then( m => m.OlvidacontraPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/notfound/notfound.module').then( m => m.NotfoundPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
