export class Enumeration {
    group: string = '';
    name: string = '';
    description: string = '';
    value: number = 0;

    constructor(group: string) {
        this.group = group;
    }

    parse(json: any): Enumeration {
        if(json['name']){
            this.setName(json['name']);
        }

        if(json['description']){
            this.setDescription(json['description']);
        }

        if(json['value']){
            this.setValue(json['value']);
        }

        return this;
    }

    setName(name: string): Enumeration {
        this.name = name;
        return this;
    }

    setDescription(description: string): Enumeration {
        this.description = description;
        return this;
    }

    setValue(value: string): Enumeration {
        this.value = Number(value);
        return this;
    }
}