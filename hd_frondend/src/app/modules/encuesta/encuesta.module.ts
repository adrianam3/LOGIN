import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncuestaRoutingModule } from './encuesta-routing.module';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncuestaFormComponent } from './project/encuesta-form/encuesta-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { EncuestaListComponent } from './project/encuesta-list/encuesta-list.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    EncuestaFormComponent,
    EncuestaListComponent
  ],
  imports: [
    CommonModule,
    EncuestaRoutingModule,
    ButtonModule,
    FormsModule,
    RatingModule,
    InputTextareaModule,
    TabMenuModule,
    ToolbarModule,
    InputTextModule,
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    ProgressSpinnerModule,

  ],
  providers: [
      ConfirmationService,
      MessageService,
  ],
})
export class EncuestaModule { }
