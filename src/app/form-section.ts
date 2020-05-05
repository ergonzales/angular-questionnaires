import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export class FormSection {

  constructor(
    public name?: string,
    public title?:{
      EN?: string,
      FR?: string
    },
    public isComplete?: boolean,
    public questions?: Array<any>,
    public formGroup?: FormGroup
  ) {  }

}
