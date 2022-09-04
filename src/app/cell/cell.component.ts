import { Component, Input, OnInit } from '@angular/core';
import { boardCell } from '../game.service';
@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  @Input() cellData: boardCell =  {
    id: 0,
    value: 0,
    isDisabled: false,
  };
  
  constructor() { }

  ngOnInit(): void {
  }

}
