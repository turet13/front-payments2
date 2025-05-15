// Ejemplo de cómo un módulo podría exportar un componente standalone
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';


@NgModule({
  imports: [
    CommonModule,
    NavigationComponent 
  ],
  exports: [NavigationComponent] 
})
export class NavigationModule {}
