import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ZapatillasPageRoutingModule } from './zapatillas-routing.module';

import { ZapatillasPage } from './zapatillas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ZapatillasPageRoutingModule
  ],
  declarations: [ZapatillasPage]
})
export class ZapatillasPageModule {}
