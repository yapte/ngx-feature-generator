export const TEMPLATE: Record<string, string> = {
    COMPONENT_TS: `import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { {{PascalName}}Page } from '../{{kebab-name}}-page.interface';
import { {{PascalName}}FacadeService } from '../{{kebab-name}}-facade.service';
import { HandledError } from '../helpers/handled-error';

@Component({
    selector: 'app-{{kebab-name}}',
    templateUrl: './{{kebab-name}}.component.html',
    styleUrls: ['./{{kebab-name}}.component.scss'],
    providers: [{{PascalName}}FacadeService],
})
export class {{PascalName}}Component {
    page$: Observable<{{PascalName}}Page> = this._facade.page$;
    inProgress$: Observable<boolean> = this._facade.inProgress$;
    error$: Observable<HandledError> = this._facade.error$;

    constructor(private _facade: {{PascalName}}FacadeService) { }
    
    // ... 
}`,

    COMPONENT_SCSS: ``,

    COMPONENT_HTML: `<div *ngIf="page$ |async as page" class="wrap">
    Feature generator: app-{{kebab-name}} component
    <pre> {{page |json}} </pre>
</div>

<div *ngIf="inProgress$ |async" [style.color]="'yellow'"> IN PROGRESS ... </div>

<div *ngIf="error$ |async as error" [style.color]="'red'">
    <pre> {{error |json}} </pre>
</div>`,

    API_SERVICE: `import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { {{PascalName}}Dto } from './{{kebab-name}}-dto.interface';

@Injectable({ providedIn: 'root' })
export class {{PascalName}}ApiService {
    private _basePath = \`\${environment.baseUrl}/{{kebab-name}}\`

    constructor(private _http: HttpClient) { }

    list(): Observable<{{PascalName}}Dto[]> {
        return this._http.get<{{PascalName}}Dto[]>(\`\${this._basePath}/list\`);
    }
}`,

    REPO_SERVICE: `import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
}`,

    FACADE_SERVICE: `import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { {{PascalName}}Page } from './{{kebab-name}}-page.interface';
import { {{PascalName}}RepoService } from './{{kebab-name}}-repo.service';
import { HandledError } from './helpers/handled-error';

@Injectable()
export class {{PascalName}}FacadeService implements OnDestroy {
    private _destroy$ = new Subject<boolean>();
    private _page$ = new BehaviorSubject<{{PascalName}}Page>(null);
    private _inProgress$ = new BehaviorSubject<boolean>(false);
    private _error$ = new BehaviorSubject<HandledError>(null);

    page$: Observable<{{PascalName}}Page> = this._page$.pipe(
        takeUntil(this._destroy$),
        filter(p => !!p),
    );
    inProgress$: Observable<boolean> = this._inProgress$.asObservable();
    error$: Observable<HandledError> = this._error$.asObservable();

    constructor(private _{{camelName}}Repo: {{PascalName}}RepoService) {}

    private _fetchData() {
        // TODO: 
        this._{{camelName}}Repo.list().subscribe();
        this._page$.next({/* Page */});
    }

    init() {
        this._fetchData();
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}`,

    PAGE_MODEL_INTERFACE: `export interface {{PascalName}}Page {

}`,

    MODEL_CLASS: `import { {{PascalName}}Dto } from './{{kebab-name}}-dto.interface';

export class {{PascalName}} {
    constructor(dto: {{PascalName}}Dto) {
        
    }
}`,

    MODEL_DTO_INTERFACE: `export interface {{PascalName}}Dto {

}`,

    ERROR_TYPE_ENUM: `export enum ErrorType {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Failure,
}`,
    
    HANDLED_ERROR_MODEL: `import { ErrorType } from './error-type.enum';

export class HandledError {
    constructor(
        public message: string,
        public errorType: ErrorType,
        public errorMap?: Record<string, string>,
    ) { }
}`,

    DEFAULT_ERROR_HANDLER_FUNCTION: `import { ErrorType } from './error-type.enum';
import { HandledError } from './handled-error';

export const defaultErrorHandler = (err: any): HandledError => {
    if (+err.code === 400) {
        return new HandledError(err.message, ErrorType.BadRequest, err?.errors);
    }

    if (+err.code === 401) {
        return new HandledError(err.message, ErrorType.Unauthorized);
    }

    if (+err.code === 403) {
        return new HandledError(err.message, ErrorType.Forbidden);
    }

    if (+err.code === 404) {
        return new HandledError(err.message, ErrorType.NotFound);
    }

    if (+err.code >= 500) {
        return new HandledError('Ошибка сервера', ErrorType.Failure);
    }

    return new HandledError(err?.message ?? 'Неизвестная ошибка', ErrorType.Unauthorized);
}`,

};