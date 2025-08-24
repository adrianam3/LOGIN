import { Component } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
    templateUrl: './emptydemo.component.html'
})
export class EmptyDemoComponent {
    public texto = '';

    public imprimir() {
        console.log('' + this.texto);
    }
}
