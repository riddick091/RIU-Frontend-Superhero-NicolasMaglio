import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <router-outlet></router-outlet>
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
  }`]
})
export class AuthLayout {

}
