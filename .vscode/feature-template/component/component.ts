import { Component } from '@angular/core';
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
}