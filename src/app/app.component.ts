import { Component } from '@angular/core';
import { SorteoService } from "./sorteo.service";
import { isNumeric } from 'rxjs/util/isNumeric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LotoCheck';
   
  constructor(private sorteoService : SorteoService) { 
    
  }

  getPremioTotal() : number {
    return this.sorteoService.getTotalPremio();
  }
  getEstadoSorteo() : string {
    return this.sorteoService.getStatus();
  }
  getUltimaActualizacion() : Date {
    return this.sorteoService.getUltimaActualizacion();
  }

  addNum(newPer: string, newLug: string, newNum : number){
    if (!this.sorteoService.existNum(newNum)){
      
      this.sorteoService.addNum(newPer, newLug, newNum);
      this.clearInput();
      
    }else{
      document.querySelector("#n"+newNum).classList.add('exist');
    }
   
  }

  existNum(num: number){    
    return this.sorteoService.existNum(num);
  }

  handleInputNum(persona: string, lugar: string,  e){
    //console.log(e.charCode);
    switch (e.charCode) {
      case 13:
       this.addNum(persona, lugar, e.target.value);
        break;
      /*case 8:
      case 46:
        break;*/
      default:
        if (e.target.value.length == 5  || !isNumeric(e.key)) e.preventDefault();
        break;
    }
  }

  handleChange(e){} //JGL: caso raro, si no lo gestiono no detecta cambio a veces
  
  private clearInput(){
    Array.from(document.getElementsByClassName("dataInput")).forEach( elem => {
        (<HTMLInputElement> elem).value = "";
    });  
    document.getElementById("newPer").focus();
  }
}
