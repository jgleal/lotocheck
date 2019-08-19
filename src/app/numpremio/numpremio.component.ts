import { Component, OnInit } from '@angular/core';
import { SorteoService, numPremio } from "../sorteo.service";

@Component({
  selector: 'app-numpremio',
  templateUrl: './numpremio.component.html',
  styleUrls: ['./numpremio.component.css']  
})
export class NumpremioComponent implements OnInit {  
  constructor(private sorteoService : SorteoService) { 
        
  }

  removeTransition(event) {
    if (event.propertyName !== 'transform') return;
    event.target.classList.remove('exist');
 }

  public removeNumero(n : number){
    this.sorteoService.removeNum(n);       
  }

  public getNumPremios() : Array<numPremio>{
    return this.sorteoService.getNumPremios()
  }

  ngOnInit() {
    
  }
   
}