import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonaRoutingModule } from './persona-routing.module';
import { PersonaFormComponent } from './project/persona-form/persona-form.component';
import { PersonaListComponent } from './project/persona-list/persona-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { PanelModule } from 'primeng/panel';
import { MultiSelectModule } from 'primeng/multiselect';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TreeTableModule } from 'primeng/treetable';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UtilitiesModule } from 'src/app/demo/components/utilities/utilities.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [PersonaFormComponent, PersonaListComponent],
  imports: [
    CommonModule,
    PersonaRoutingModule,
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
export class PersonaModule { }
