import { Observable } from 'rxjs/Observable';

export class Varsyncer{
    varname: any;
    varobserver: any;

    constructor() {
        //this.varname = varname;
        this.varname = Observable.create(observer => {
            this.varobserver = observer;
        });
    }

    sync(somevar): void{
        this.varobserver.next(somevar);
    }
}