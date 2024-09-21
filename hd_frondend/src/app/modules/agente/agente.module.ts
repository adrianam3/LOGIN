import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgenteRoutingModule } from './agente-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AgenteListComponent } from './project/agente-list/agente-list.component';
import { AgenteFormComponent } from './project/agente-form/agente-form.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeTableModule } from 'primeng/treetable';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UtilitiesModule } from 'src/app/demo/components/utilities/utilities.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AgenteListComponent,
    AgenteFormComponent
    ],
  imports: [
    AgenteRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    AccordionModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule,
    MessagesModule,
    TooltipModule,
    InputTextareaModule,
    ConfirmDialogModule,
    ToolbarModule,
    FieldsetModule,
    CardModule,
    DialogModule,
    ToastModule,
    RadioButtonModule,
    InputMaskModule,
    PanelModule,
    MultiSelectModule,
    SplitButtonModule,
    TreeTableModule,
    InputSwitchModule,
    UtilitiesModule,
    HttpClientModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
})
export class AgenteModule { }
