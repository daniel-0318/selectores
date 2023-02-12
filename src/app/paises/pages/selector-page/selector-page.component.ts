import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.scss']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required], 
    pais: ['', Validators.required], 
    frontera: ['', Validators.required], 
  });

  //lenar selectores
  regiones  :string[] = [];
  paises    : PaisSmall[] = [];
  fronteras : PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { 
    console.log("Ok!");
    
  }

  ngOnInit() {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap((_) =>{
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      } ),
      switchMap(region=>this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises =>{
      this.paises = paises;
      this.cargando = false;
    });


    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap((_) =>{
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo) ),
      switchMap(pais => this.paisesService.getPaisPorCodigos(pais?.borders! ) )
    )
    .subscribe( paises=>{

      this.fronteras = paises;
      this.cargando = false;
    });



  }

  guardar(){
    console.log(this.miFormulario.value);
    
  }

}
