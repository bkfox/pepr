
import Database from './database';
import Model from './model';
import {Directive, Attr, Field, Index} from './directives';


export {Database, Model, Attr, Field, Index};



/**
    // me   -> one      source/pk: me   -> target: one      : one
    // me   -> many     source/pk: me   -> target: [many]   : [many]
    // many -> me       source/pk: many -> target: me       : [many]
    // one  -> me       source/pk: one  -> target: me       : one


export class Relation extends Directive {
    constructor(target, {reverse=false, many=false, ...options}={}) {
        super(options)
        this.field = field;
        this.target = target;
        this.reverse = reverse;
        this.many = many;
    }

    get(obj) {
        const lookup = obj[this.field];
        const all = this.target.$getters('all');
        return this.many ? (lookup || []).map(pk => all('all')[pk])
                         : all[lookup];
    }

}
*/



export class TestModel extends Model {
}

TestModel.modelize({
    fields: {
        'a': Field({attr:'a_c'}),
        'b': Index({attr:'a_b'}),
    }
})




