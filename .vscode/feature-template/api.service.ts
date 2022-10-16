import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { {{PascalName}}Dto } from './{{kebab-name}}-dto.interface';

@Injectable({ providedIn: 'root' })
export class {{PascalName}}ApiService {
    private _basePath = `${environment.baseUrl}/{{kebab-name}}`

    constructor(private _http: HttpClient) { }

    list(): Observable<{{PascalName}}Dto[]> {
        return this._http.get<{{PascalName}}Dto[]>(`${this._basePath}/list`);
    }
}