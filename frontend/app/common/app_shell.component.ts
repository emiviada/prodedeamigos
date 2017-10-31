import { Component } from '@angular/core';

@Component({
  selector: 'app-shell',
  template: `
    <main id="panel" class="slideout-panel">
      <header>
        <div class="row ptm">
          <div class="col-xs-12 text-center">
            <a routerLink="/dashboard" class="logo">
              <img src="/assets/imgs/prode-logo-small.png" />
              <span class="logo-title hidden-xs">Prode De Amigos</span>
            </a>
          </div>
        </div>
      </header>
      <div class="main-content">
        <div class="row text-center">
          <md-spinner></md-spinner>
        </div>
      </div>
    </main>
  `,
  styles: [`
    [_nghost-c2],[_nghost-c3] { display: inline-block; }
    .main-content { padding-top: 100px; }
  `],
})
export class AppShellComponent { }
