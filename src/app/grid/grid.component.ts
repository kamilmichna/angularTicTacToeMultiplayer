import { Component, OnInit } from '@angular/core';
import { boardCell, GameService } from '../game.service';
import { concatAll, flatMap, map, mergeAll } from 'rxjs';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  public boardState$ = this.gameService.boardState$;

  constructor(
    private gameService: GameService
  ) { }


  ngOnInit(): void {
  }

  onCellClick(cellData: boardCell){
    if (cellData.isDisabled || cellData.value !== 0) return;
    this.gameService.onUserAction(cellData.id);
  }

}
