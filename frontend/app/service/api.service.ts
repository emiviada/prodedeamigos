import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  private baseUrl = environment.api_url + '/api';  // URL to web API
  private apiUsername = environment.api_user;
  private apiPassword = environment.api_password;

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-PRODE-AUTH-TOKEN': this.apiUsername + ':' + this.apiPassword
  });

  constructor (private http: Http) {}

  /*** USERS functionalities ***/

  // findUsers
  findUsers(params) {
    let query = Object.keys(params)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
    return this.http.get(this.baseUrl + '/users?' + query, {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  // createUser
  createUser(params) {
    return this.http.post(this.baseUrl + '/users?', JSON.stringify(params), {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  // editUser
  editUser(userId, params) {
    return this.http.put(this.baseUrl + '/users/' + userId, JSON.stringify(params), {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*** END USERS functionalities ***/

  /*** FANTASY TOURNAMENTS functionalities ***/

  // getFantasyTournaments
  getFantasyTournaments(userId) {
    return this.http.get(this.baseUrl + '/users/' + userId + '/fantasy-tournaments', {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getFantasyTournament (by slug)
  getFantasyTournament(userId, slug) {
    return this.http.get(this.baseUrl + '/users/' + userId + '/fantasy-tournaments/' + slug, {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  createFantasyTournament(userId, object) {
    let data = {'fantasy_tournament': object};
    return this.http.post(
      this.baseUrl + '/users/' + userId + '/fantasy-tournaments',
      data,
      {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
  }

  /*** END FANTASY TOURNAMENTS functionalities ***/

  /*** TOURNAMENTS functionalities ***/

  // getTournaments
  getTournaments() {
    return this.http.get(this.baseUrl + '/tournaments', {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*** END TOURNAMENTS functionalities ***/

  /*** GAMES functionalities ***/

  // getGames
  getGames(userId, FantasyTournamentSlug) {
    return this.http.get(
      this.baseUrl + '/users/' + userId + '/fantasy-tournaments/' + FantasyTournamentSlug + '/games',
      {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
  }

  /*** END GAMES functionalities ***/

  /*** PREDICTIONS functionalities ***/

  // getPredictions
  getPredictions(userId, FantasyTournamentSlug) {
    return this.http.get(
      this.baseUrl + '/users/' + userId + '/fantasy-tournaments/' + FantasyTournamentSlug + '/predictions',
      {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
  }

  // editPrediction
  editPrediction(userId, fantasyTournamentSlug, prediction) {
    let data = {
      'prediction': {
        "goalsHome": prediction.goals_home,
        "goalsAway": prediction.goals_away
      }
    };
    return this.http.put(
      this.baseUrl + '/users/' + userId + '/fantasy-tournaments/' + fantasyTournamentSlug + '/predictions/' + prediction.id,
      data,
      {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
  }

  // newPrediction
  newPrediction(userId, fantasyTournamentSlug, prediction) {
    let data = {
      'prediction': {
        "game": prediction.game.id,
        "goalsHome": prediction.goals_home,
        "goalsAway": prediction.goals_away
      }
    };
    return this.http.post(
      this.baseUrl + '/users/' + userId + '/fantasy-tournaments/' + fantasyTournamentSlug + '/predictions',
      data,
      {headers: this.headers})
        .map(this.extractData)
        .catch(this.handleError);
  }

  /*** END PREDICTIONS functionalities ***/

  private extractData(res: Response) {
    let data = {};
    if (res.status === 200) {
        data = res.json();
    } else if (res.status === 201) {
        let headers = res.headers;
        data = headers.get('Location');
    } else if (res.status === 204) {
        // No Content
    } else {
        this.handleError(res);
    }

    return data;
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    //console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
