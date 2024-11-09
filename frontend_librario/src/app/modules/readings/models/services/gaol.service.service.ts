import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateGoal, GoalPreview, GoalDetails, UpdateGoal } from '../interfaces/goal.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GaolService {

  private _http = inject(HttpClient);

  constructor() {}

  public getGoals(): Observable<GoalPreview[]> {
    return this._http.get<GoalPreview[]>(environment.goals);
  }

  public getGoal(id: string): Observable<GoalDetails> {
    return this._http.get<GoalDetails>(`${environment.goals}/${id}`);
  }

  public createGoal(goal: CreateGoal): Observable<any> {
    return this._http.post(environment.goals, goal);
  }

  public updateGoal(goalId: string, goal: UpdateGoal): Observable<any> {
    return this._http.patch(`${environment.goals}/${goalId}`, goal);
  }

  public deleteGoal(id: string): Observable<any> {
    return this._http.delete(`${environment.goals}/${id}`);
  }

}
