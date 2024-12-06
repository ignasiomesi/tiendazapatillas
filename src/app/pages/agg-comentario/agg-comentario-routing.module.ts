import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggComentarioPage } from './agg-comentario.page';

const routes: Routes = [
  {
    path: '',
    component: AggComentarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggComentarioPageRoutingModule {}
