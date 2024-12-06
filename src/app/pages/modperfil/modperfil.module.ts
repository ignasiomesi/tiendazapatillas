import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModperfilPageRoutingModule } from './modperfil-routing.module';

import { ModperfilPage } from './modperfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModperfilPageRoutingModule
  ],
  declarations: [ModperfilPage]
})
export class ModperfilPageModule {}
