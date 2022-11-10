
export class cstring {
    value: string;

    constructor(line: string = ''){
        this.value = line;
    }

    toString() {
        return this.value;
    }
    
    append(line: string): cstring {
        this.value += line + '\n';
        return this;
    }

    static capitalizeFirstLetter(word: string){
        let firstLetter = word.substring(0, 1);
        return (firstLetter.toUpperCase() + word.substring(1).toLowerCase());
    }
}

