import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { configMultiplayer, configSingle } from 'src/configs/game-configs';
import { deepCopyArray } from './utils';
import Swal from 'sweetalert2';

export interface boardCell {
  id: number;
  value: number;
  isDisabled: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class GameService {
  // 0 for empty field, 1 for x, -1 for o
  boardInitialState: boardCell[] = 
    [
      {
        id: 0,
        value: 0,
        isDisabled: false,
      },
      {
        id: 1,
        value: 0,
        isDisabled: false,
      },
      {
        id: 2,
        value: 0,
        isDisabled: false,
      },
      {
        id: 3,
        value: 0,
        isDisabled: false,
      },
      {
        id: 4,
        value: 0,
        isDisabled: false,
      },
      {
        id: 5,
        value: 0,
        isDisabled: false,
      },
      {
        id: 6,
        value: 0,
        isDisabled: false,
      },
      {
        id: 7,
        value: 0,
        isDisabled: false,
      },
      {
        id: 8,
        value: 0,
        isDisabled: false,
      }
  ];

  // using slice to copy array values, not the reference
  boardState: boardCell[] = deepCopyArray(this.boardInitialState);

  // x starts for default
  actualPlayer = 1;

  actualPlayer$ = new BehaviorSubject(this.actualPlayer);
  boardState$ = new BehaviorSubject(this.boardState);
  userAction$ = new Subject();
  winner$: BehaviorSubject<any> = new BehaviorSubject(null);
  gamemode$ = new BehaviorSubject('single');
  gamemode: 'single' | 'ai' | 'multiplayer' | null = null;
  config: GameConfig = configSingle;
  
  constructor(){
    this.winner$.subscribe(winner => {
        this.handleWinner(winner);
        if (winner === 0){
          Swal.fire(`Draw`)
        }
        Swal.fire(`Player ${winner === -1 ? "O" : "X"} wins`)
    })
  }
  
  selectGameMode(gamemode: 'single' | 'ai' | 'multiplayer'){
    this.gamemode$.next(gamemode);
    this.gamemode = gamemode;
    this.config = this.getConfigForGamemode(gamemode);
  }

  getConfigForGamemode(gamemode: 'single' | 'ai' | 'multiplayer') {
    if (gamemode === 'single') return configSingle;
    return configMultiplayer;
  }

  handleWinner(winner: number){
    this.resetBoardState();
  }

  onUserAction(id: number, propagate = true) {
    this.setupGame(propagate);
    if (this.checkIfUserActionCannotBeFired(propagate)) return;
    const index = this.boardState.findIndex(cell => cell.id === id);
    this.boardState[index].value = this.actualPlayer;
    if (propagate) {
      this.userAction$.next(id);
    } 
    this.boardState$.next(this.boardState);
    this.validateGameResult();
  }


  checkIfUserActionCannotBeFired(propagate: boolean) {
    console.log(this.config);
    console.log(this.actualPlayer);
    const multiplayerChecks = {
      checkIfActionIsFromActualPlayer:
        this.config.mode === 'multiplayer' &&
        this.config.multiplayerPlayer !== undefined &&
        (this.config.multiplayerPlayer !== this.actualPlayer && propagate),
    };
    return (
      !this.gamemode ||
      !this.config ||
      multiplayerChecks.checkIfActionIsFromActualPlayer
    );
  }

  setupGame(propagate: boolean) {
    if (!propagate) return
    if (this.config.mode === 'multiplayer') {
      if (this.config.multiplayerPlayer === undefined){
        this.config.multiplayerPlayer = this.actualPlayer;
      }
    }
  }

  toggleActualPlayer() {
    this.actualPlayer = -this.actualPlayer;
    this.actualPlayer$.next(this.actualPlayer);
  }

  checkIfBoardHasEmptyFields() {
    return this.boardState.some(cell => cell.value === 0);
  }

  validateGameResult() {
    const board2d = this.make2dArrayFromBoardState();
    let valueToCheck = this.actualPlayer;
    if (this.checkRows(board2d,valueToCheck) || this.checkColumns(board2d,valueToCheck)){
      this.winner$.next(valueToCheck);
    }

    if (!this.checkIfBoardHasEmptyFields()) this.winner$.next(0);
    this.toggleActualPlayer(); 
  }
  
  checkRows(board2d: number[][], value: number): boolean {
    return board2d.some(row => {
      return row[0] === value && row[1] === value && row[2] === value;
    })
  }

  checkColumns(board2d: number[][], value: number): boolean {
    for (let i = 0; i < 3; i++){
      if (board2d[0][i] === value && board2d[1][i] === value && board2d[2][i] === value){
        return true;
      }
    }
    return false;
  }

  resetBoardState(){
    this.boardState = deepCopyArray(this.boardInitialState);
    this.actualPlayer = 1;
    this.actualPlayer$.next(this.actualPlayer);
    this.boardState$.next(this.boardState);
  }

  make2dArrayFromBoardState(): number[][] {
    return [
      [this.boardState[0].value,this.boardState[1].value,this.boardState[2].value],
      [this.boardState[3].value,this.boardState[4].value,this.boardState[5].value],
      [this.boardState[6].value,this.boardState[7].value,this.boardState[8].value],
    ]
  }
}
