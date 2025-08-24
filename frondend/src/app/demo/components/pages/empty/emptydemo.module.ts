import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDemoRoutingModule } from './emptydemo-routing.module';
import { EmptyDemoComponent } from './emptydemo.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EmptyDemoRoutingModule,
        QuillModule,
        ButtonModule
    ],
    declarations: [EmptyDemoComponent]
})
export class EmptyDemoModule { }
