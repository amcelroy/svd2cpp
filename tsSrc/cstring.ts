
export class cstring {
    value: string;

    constructor(line: string = ''){
        this.value = line;
    }

    toString() {
        return this.value;
    }
    
    append(line: string | undefined, cr: boolean = true): cstring {
        if(line){
            this.value += line;
            if(cr){
                this.endl();
            }
        }
        return this;
    }

    endl() {
        this.value += "\n";
    }

    static capitalizeFirstLetter(word: string){
        let firstLetter = word.substring(0, 1);
        return (firstLetter.toUpperCase() + word.substring(1).toLowerCase());
    }
}

