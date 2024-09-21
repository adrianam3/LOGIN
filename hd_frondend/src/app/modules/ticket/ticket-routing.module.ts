import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from './project/ticket-list/ticket-list.component';
import { TicketFormComponent } from './project/ticket-form/ticket-form.component';

const routes: Routes = [
    { path: 'ticket-list', component: TicketListComponent },
    { path: 'ticket-form', component: TicketFormComponent },
    { path: 'ticket-form/:codigo', component: TicketFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketRoutingModule { }
