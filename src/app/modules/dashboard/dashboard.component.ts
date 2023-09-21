import { Component } from '@angular/core';
import { UtilService } from 'src/app/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private utilService: UtilService) {}

  addDespesa() {
    
  }
  
  addReceita() {
   
  }

}
