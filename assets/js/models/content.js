/** @module models/content **/
import Record from 'pepr/orm/record';
import {Attr, Collection, Reference} from 'pepr/orm/directives';

export default class Content extends Record {

}

Content.fields = {
}

Content.directives = [
    Collection(),
]

