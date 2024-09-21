import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolRoutingModule } from './rol-routing.module';
import { RolListComponent } from './project/rol-list/rol-list.component';
import { RolFormComponent } from './project/rol-form/rol-form.component';
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


@NgModule({
    declarations: [RolListComponent, RolFormComponent],
    imports: [
        CommonModule,
        RolRoutingModule,
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
export class RolModule { }
