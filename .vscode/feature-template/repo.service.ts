import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { defaultErrorHandler } from "./helpers/default-error-handler.function";

import { {{PascalName}} } from './{{kebab-name}}';
import { {{PascalName}}ApiService } from './{{kebab-name}}-api.service';
import { {{PascalName}}Dto } from './{{kebab-name}}-dto.interface';

@Injectable({providedIn: 'root'})
export class {{PascalName}}RepoService {

    constructor(private _{{camelName}}Api: {{PascalName}}ApiService) { }

    list(): Observable<{{PascalName}}[]> {
        return this._{{camelName}}Api.list()
            .pipe(
                map(items => items.map(
                    (dto: {{PascalName}}Dto) => {
                        try {
                            return new {{PascalName}}(dto);
                        } catch (err: any) {
                            throw new Error(err?.error?.message ?? err?.message ?? 'Ошибка преобразования модели {{PascalName}}Dto => {{PascalName}} X(|');
                        }
                    }
                )),
                catchError((err) => throwError(() => defaultErrorHandler(err))),
            );
    }
}