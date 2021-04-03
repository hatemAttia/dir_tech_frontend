import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  path = "http://localhost:3000/api";
  /**
   * Option http
   */
  private createRequestOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headers;
  }

  /**
   * traitement Erreur
   * @param erreur 
   */
  traitementErreur(erreur: HttpErrorResponse) {
    if (erreur.error instanceof ErrorEvent) {
      console.log('Une erreur s est produite', erreur.error.message);
    } else
      console.error("code renvoyé par le backen " + erreur.status +
        + "le corps était : " + JSON.stringify(erreur.error));
    return throwError("quelque chose est arrivé ; Veuillez reessayer plus tard");
  }

  /**
  * Get all skills
  * @param element 
  */
  getAllSkills() {
    return this.http.get("http://localhost:3000/api/skill/all").pipe(retry(2),
      catchError(this.traitementErreur));
  }

  /**
  * Login admin
  * @param element 
  */
  addEnseignant(data) {
    const options = this.createRequestOptions();
    return this.http.post(this.path + "/enseignant/new", JSON.stringify(data), { headers: options }).
      pipe(retry(2),
        catchError(this.traitementErreur))
  }

  /**
  * Login admin
  * @param element 
  */
   addPersonel(data) {
    const options = this.createRequestOptions();
    return this.http.post(this.path + "/personel/new", JSON.stringify(data), { headers: options }).
      pipe(retry(2),
        catchError(this.traitementErreur))
  }

  /**
   * Login admin
   * @param element 
   */
   stuffLogin(data) {
    const options = this.createRequestOptions();
    return this.http.post(this.path+"/auth/stuff", JSON.stringify(data), { headers: options }).
      pipe(retry(2),
        catchError(this.traitementErreur))
  }
}
