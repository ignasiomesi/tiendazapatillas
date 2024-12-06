import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlvidacontraPage } from './olvidacontra.page';

const routes: Routes = [
  {
    path: '',
    component: OlvidacontraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidacontraPageRoutingModule {}
