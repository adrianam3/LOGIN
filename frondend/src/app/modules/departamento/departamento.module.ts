import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DepartamentoListComponent } from './project/departamento-list/departamento-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    DepartamentoListComponent,
  ],
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
})
export class DepartamentoModule { }
