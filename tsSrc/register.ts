import { cstring } from './cstring';

enum Access {
    Read,
    Write,
    ReadWrite
}

class Enumeration {
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

class Field {
    name: string = '';
    description: string = '';
    bitRange: string = '';
    bitMask: number = 0;
    access: Access = Access.ReadWrite;
    low_bit: number = 0;
    high_bit: number = 0;
    enumerations: Enumeration[] = [];
    isBool: boolean = false;
    cpp: string = '';

    parse(json: any): Field {
        if(json['name']){
            this.name = json['name'];

            let splits = this.name.split('_');
            if(splits.length > 1){
                this.name = this.name.split('_')[splits.length - 1];
            }
        }

        if(json['description']) {
            this.description = json['description'];
        }

        if(json['bitRange']){
            this.setBitRange(json['bitRange']);
        }

        if(json['enumeratedValues']){
            let ev = json['enumeratedValues']['enumeratedValue'] as Array<any>;

            if(ev.length === undefined){
                //TODO: Enumarate a single enumeration?
                //this.enumerations.push(new Enumeration(this.name).parse(ev));
            }else{
                ev.forEach( ev => {
                    this.enumerations.push(new Enumeration(this.name).parse(ev));
                });
            }
        }

        return this;
    }

    setName(name: string): Field {
        let name_splits = name.split('_');
        this.name = name_splits[name_splits.length - 1];
        return this;
    }

    setBitRange(range: string): Field {
        this.bitRange = range;
        this.bitRangeToMask();
        return this;
    }

    bitRangeToMask() {
        let trimmed = this.bitRange.slice(1, -1);
        let bits = trimmed.split(':');
        this.high_bit = Number(bits[0]);
        this.low_bit = Number(bits[1]);
        this.bitMask = this.high_bit - this.low_bit + 1; //Zero indexed bits
        this.bitMask = 2**this.bitMask - 1;
        if(this.bitMask == 1){
            this.isBool = true;
        }
    }

    getter(): string {
        let tmp = new cstring();

        let return_value = 'T';
        if(this.enumerations.length){
            return_value = `e_${this.enumerations[0].group}`;
        }

        tmp.append(`/**`);
        tmp.append(`* Get ${this.name} register`);
        tmp.append(`*`);
        tmp.append(`* @brief ${this.description}`);
        tmp.append(`* @return ${return_value}`)
        tmp.append(`*/`);

        if(this.isBool){
            tmp.append(`__STATIC_FORCEINLINE bool ${this.name}() {`);
            tmp.append(`    return GetBit(${this.low_bit})`);
        }else{
            tmp.append(`__STATIC_FORCEINLINE ${return_value} ${this.name}() {`);
            tmp.append(`    return (this->value >> ${this.low_bit}) & ${ this.bitMask.toString(16) };`);
        }
        tmp.append(`}`);
        return tmp.value;
    }

    setter(): string {
        let tmp = new cstring();
        
        let return_value = 'T';
        if(this.enumerations.length){
            return_value = `e_${this.enumerations[0].group}`;
        }

        tmp.append(`/**`);
        tmp.append(`* Set ${this.name} register`);
        tmp.append(`*`);
        tmp.append(`* @brief ${this.description}`);
        tmp.append(`* @return ${return_value}`)
        tmp.append(`*/`);

        if(this.isBool){
            tmp.append(`__STATIC_FORCEINLINE Register ${this.name}(bool value) {`);
            tmp.append(`    if(value){`);
            tmp.append(`        SetBit(${this.low_bit});`);
            tmp.append(`    }else{`);
            tmp.append(`        ClearBit(${this.low_bit});`);
            tmp.append(`    }`);
        }else{
            tmp.append(`__STATIC_FORCEINLINE Register ${this.name}(${return_value} value) {`);
            tmp.append(`    this.value &= ~((value & 0x${ this.bitMask.toString(16) }) << ${this.low_bit});`);
            tmp.append(`    this.value |= (value & 0x${ this.bitMask.toString(16) }) << ${this.low_bit};`);
        }

        tmp.append(`    return *this;`)
        tmp.append(`}`);
        return tmp.value;
    }

    enumerationToCPP(): string {
        let tmp = new cstring();

        tmp.append(`enum class e_${this.name} {`);

        this.enumerations.forEach( e => {
            tmp.append(`${e.name} = ${e.value}; /// ${e.description}`);
        });

        tmp.append(`};`)

        return tmp.value;
    }

    toCPP(): string {
        let tmp = new cstring();

        if(this.enumerations.length > 1) {
            //TODO: Fill in enumerations
            this.enumerationToCPP();
        }

        switch(this.access){
            case Access.Read:
                tmp.append(this.getter());
                break;
            case Access.Write:
                tmp.append(this.setter());
                break;
            case Access.ReadWrite:
                tmp.append(this.getter());
                tmp.append(this.setter());
                break;
        }
        
        this.cpp = tmp.value;
        return this.cpp;
    }
}

export class Register {
    headers: string = '';
    namespace: string = '';
    access: Access = Access.ReadWrite;
    description: string = '';
    addressOffset: number = 0;
    name: string = '';
    fields: Field[] = [];

    address_type: string;
    value_type: string;
    base_address: number;

    cpp: string = '';

    constructor(address_type: string, value_type: string, base_address: string){
        this.base_address = parseInt(base_address);
        this.address_type = address_type;
        this.value_type = value_type;
    }

    setDescription(description: string): Register {
        this.description = description;
        return this;
    }

    setName(name: string): Register {
        this.name = name;
        return this;
    }

    setAddressOffset(offset: string): Register {
        this.addressOffset = parseInt(offset, 16);
        return this;
    }

    parse(json: any) : Register {
        if(json['name']) {
            this.name = json['name'];
        }

        if(json['description']) {
            this.description = json['description'];
        }

        if(json['addressOffset']) {
            this.addressOffset = json['addressOffset'];
        }

        if(json['fields']) {
            let x = json['fields']['field'] as Array<any>;

            if(x.length === undefined){
                this.fields.push(new Field().parse(x));
            }else{
                x.forEach( field => {
                    this.fields.push(new Field().parse(field));
                });
            }


        }

        return this;
    }

    toCPP() {
        let tmp = new cstring();

        let address = (this.base_address + this.addressOffset).toString(16);

        tmp.append(`template<${this.address_type},`);
        tmp.append(`        0x${address},`);
        tmp.append(`        ${this.value_type}>`);
        tmp.append(`class ${this.name} : public Register<${this.address_type},`);
        tmp.append(`                                0x${address},`);
        tmp.append(`                                ${this.value_type}>{`);

        this.fields.forEach( field => {
            tmp.append(field.toCPP());
        });

        tmp.append(`};`);

        return tmp.value;
    }
}