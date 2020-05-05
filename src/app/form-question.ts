export class FormQuestion {
  constructor(
    public id?: string,
    public question?: {
      EN?: string,
      FR?: string
    },
    public answers?:{
      EN?: any,
      FR?: any      
    }
  ) {  }				
}
