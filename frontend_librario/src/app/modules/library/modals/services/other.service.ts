import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, CreateCategory, CreateTag, Tag } from '../interfaces/other.interface';

@Injectable()
export class OtherService {
  
  private _http = inject(HttpClient);

  constructor() {}

  public getCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(environment.category);
  }

  public createCategory(category: CreateCategory): Observable<any> {
    return this._http.post(environment.category, category);
  }

  public deleteCategory(categoryId: string): Observable<any> {
    return this._http.delete(`${environment.category}/${categoryId}`);
  }

  public getTags(): Observable<Tag[]> {
    return this._http.get<Tag[]>(environment.tag);
  }

  public createTag(tag: CreateTag): Observable<any> {
    return this._http.post(environment.tag, tag);
  }

  public deleteTag(tagId: string): Observable<any> {
    return this._http.delete(`${environment.tag}/${tagId}`);
  }

}
