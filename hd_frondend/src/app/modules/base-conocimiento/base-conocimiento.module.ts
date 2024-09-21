import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseConocimientoRoutingModule } from './base-conocimiento-routing.module';
import { BaseConocimientoListComponent } from './proyect/base-conocimiento-list/base-conocimiento-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    BaseConocimientoListComponent,
  ],
  imports: [
    CommonModule,
    BaseConocimientoRoutingModule,
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
    DropdownModule,
  ], providers: [
    ConfirmationService,
    MessageService,
  ],
})
export class BaseConocimientoModule { }
