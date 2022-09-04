import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService, boardCell } from './game.service';
import { ApiService } from './api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  connectedToBackend: boolean = false;
  subscriptions: Subscription[] = [];
  gamemode$ = this.gameService.gamemode$;
  gamemodeSelected = false;
  constructor(
    private apiService: ApiService,
    private gameService: GameService
  ) {}


  async ngOnInit() {
    const gamemode = await this.gameModePrompt();
    this.gameService.selectGameMode(gamemode);
    this.connectedToBackend = true;
    if (this.gameService.config.mode === 'multiplayer'){
      this.subscriptions = [
        this.gameService.userAction$.subscribe((id) => {
          this.apiService.sendUserAction(id as number);
        }),
        this.apiService.onUserAction$.subscribe((data) => {
          this.gameService.onUserAction(data as number, false);
        }),
      ];
    }
  }

  async gameModePrompt() {
    const {value: gamemode}  = await Swal.fire({
      title: 'Select gamemode',
      input: 'select',
      inputOptions: {
        'single': 'On this device',
        'multiplayer': 'Multiplayer',
        'ai': 'Multiplayer with AI'
      },
      inputPlaceholder: 'Select gamemode',
    })
    if (gamemode === 'multiplayer'){
      this.apiService.promptForGameData();
    }
    this.gamemodeSelected = true;
    return gamemode;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((item) => item.unsubscribe());
  }
}
