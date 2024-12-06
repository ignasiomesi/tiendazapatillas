import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidacontraPageRoutingModule } from './olvidacontra-routing.module';

import { OlvidacontraPage } from './olvidacontra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OlvidacontraPageRoutingModule
  ],
  declarations: [OlvidacontraPage]
})
export class OlvidacontraPageModule {}
