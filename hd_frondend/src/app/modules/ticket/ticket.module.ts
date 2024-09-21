import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { TableModule } from 'primeng/table';
import { TicketFormComponent } from './project/ticket-form/ticket-form.component';
import { TicketListComponent } from './project/ticket-list/ticket-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [TicketFormComponent, TicketListComponent],
  imports: [
    CommonModule,
    TicketRoutingModule,
    TableModule,
    ButtonModule,
    SplitButtonModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule,
    InputTextareaModule,
    ToolbarModule,
    DropdownModule,
    DialogModule,
    ProgressSpinnerModule,
    QuillModule,
  ],
    providers: [
    ConfirmationService,
    MessageService,
  ],
})
export class TicketModule { }

