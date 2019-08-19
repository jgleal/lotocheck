import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

export interface numPremio {
  persona: string,
  lugar: string,
  numero: number,
  premio: number,
  delete: boolean
}

@Injectable()
export class SorteoService {
  private urlCors = "https://jgleal-cors.herokuapp.com/";//"https://cors-anywhere.herokuapp.com/";
  private apiSorteo = this.urlCors + "http://api.elpais.com/ws/LoteriaNavidadPremiados?n=";
  private ultimaActualizacion : Date = null;
  private status : number = -1;
  private numPremios: Array<numPremio> = [
    /*
    {persona: "Juan", // nombre de quien aporta el número
    lugar: "Madrid",  // lugar de la compra
    numero: 00000,    // número jugado
    premio: 0,        // premio obtenido (inicialmente siempre 0)
    delete: false},   // indica si puede ser borrado
    */
  ];
  private reqInterval : number = 40000;
   

  constructor(private http: HttpClient) {
    let savedNums = JSON.parse( localStorage.getItem("numpremios18") );
    if (savedNums==null){
      this.saveNums(); 
    } else {
      this.numPremios = savedNums;
    }

    Observable.interval(this.reqInterval).startWith(0).subscribe(() => {
      this.numPremios.forEach ( n => this.setPremioToNum(n) );
    });
  }

  private setPremioToNum(n : numPremio){
    
      this.http.get(this.apiSorteo+n.numero, { responseType: 'text' } )
      .subscribe(data => {
        let objRes = JSON.parse(data.split('=')[1]);
        //console.log(objRes);
        if (objRes.error == 0) {
          n.premio = objRes.premio;
          this.status = objRes.status;
          this.ultimaActualizacion = new Date (objRes.timestamp * 1000);
        } else {
          this.status = -1;
        }
        //IF DEBUG
          //n.premio = Math.floor(Math.random() * 200);
          //this.ultimaActualizacion = new Date (Date.now());
        //
    });
    
  }

  public addNum(persona:string, lugar: string, num : number){
    if (!this.existNum(num)){
      let numP : numPremio = {persona: persona, lugar: lugar, numero:num, premio: 0, delete: true};
      this.setPremioToNum( numP );
      this.numPremios.push( numP );    
  
      this.saveNums();
    }    
  }

  public existNum(num) : boolean{
    return this.numPremios.some( n => n.numero == num );
  }

  public removeNum(num : number) {

    this.numPremios = this.numPremios.filter( n => n.numero !== num );
    
    this.saveNums();
  }

  private saveNums(){
    this.numPremios.length>0 ? 
      localStorage.setItem ( "numpremios18" , JSON.stringify (this.numPremios) ) 
      : localStorage.removeItem("numpremios18");
  }

  public getNumPremios () :  Array<numPremio> {
    return this.numPremios;
  }

  public getTotalPremio() : number {
    return this.numPremios.length>0 ? 
            this.numPremios.map(n => n.premio).reduce((p1, p2) => p1+p2)
            : 0;
  }

  public getUltimaActualizacion() : Date {
    return this.ultimaActualizacion;
  }

  public getStatus() : string {
     switch (this.status) {
        case 0:
          return "El sorteo no ha comenzado aún. Todos los números aparecerán como no premiados.";
        case 1:
          return "El sorteo ha empezado. La lista de números premiados se va cargando poco a poco. Un número premiado podría llegar a tardar unos minutos en aparecer."
        case 2:
          return "El sorteo ha terminado y la lista de números y premios debería ser la correcta aunque, tomada al oído, no podemos estar seguros de ella."
        case 3:
          return "El sorteo ha terminado y existe una lista oficial en PDF."
        case 4:
          return "El sorteo ha terminado y la lista de números y premios está basada en la oficial. De todas formas, recuerda que la única lista oficial es la que publica la ONLAE y deberías comprobar todos tus números contra ella."
        case -1:
          return "Error desconocido en el API de consulta";
        default:
          return "Error desconocido";
     }

  }

}