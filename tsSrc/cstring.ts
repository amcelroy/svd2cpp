
export class cstring {
    value: string;

    constructor(line: string = ''){
        this.value = line;
    }
    
    append(line: string): cstring {
        this.value += line + '\n';
        return this;
    }
}

