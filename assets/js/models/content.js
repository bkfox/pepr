/** @module models/content **/
import Record from 'pepr/orm/record';
import {Attr, Collection, Reference} from 'pepr/orm/directives';
import Context from './context';


export default class Content extends Record {

}

Content.fields = {
    context: Reference(Context, 'owner'),
    owner: Reference(Context, 'owner'),
}

Content.directives = [
    Collection(),
]

