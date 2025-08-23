import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  template: `
    <div class="main-layout">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
  .main-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    flex: 1; 
    padding: 30px;
    background-color: #f5f5f5;
  }
`]
})
export class MainLayout {

}
