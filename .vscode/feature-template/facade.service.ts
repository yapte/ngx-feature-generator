import { Injectable, OnDestroy } from '@angular/core';
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
}