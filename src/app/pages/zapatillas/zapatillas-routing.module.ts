import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZapatillasPage } from './zapatillas.page';

const routes: Routes = [
  {
    path: '',
    component: ZapatillasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZapatillasPageRoutingModule {}
