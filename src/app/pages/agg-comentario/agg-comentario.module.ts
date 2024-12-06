import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggComentarioPageRoutingModule } from './agg-comentario-routing.module';

import { AggComentarioPage } from './agg-comentario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggComentarioPageRoutingModule
  ],
  declarations: [AggComentarioPage]
})
export class AggComentarioPageModule {}
