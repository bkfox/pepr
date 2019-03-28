import _ from 'lodash';


export class Error {
    constructor(message, details, options={}) {
        this.message = message;
        this.details = details;
        this.report = options.report;
    }

    log() {
        console.log('Context:', this.context, '\n',
                    '"', this.message, '"\n',
                    'Details', this.details, '\n')
    }
}


