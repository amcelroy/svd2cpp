import { cstring } from "./cstring";
import { Enumeration } from "./enumeration";

export enum Access {
    Read,
    Write,
    ReadWrite
}

export class Field {
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
                this.name = this.name.toLowerCase();
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
            return_value = `e${cstring.capitalizeFirstLetter(this.enumerations[0].group)}`;
        }

        tmp.append(`/// @brief ${this.description}`);
        tmp.append(`/// @return ${return_value}`);

        if(this.isBool){
            tmp.append(`__INLINE bool ${this.name}() {`);
            tmp.append(`    return GetBit(${this.low_bit});`);
        }else{
            tmp.append(`__INLINE ${return_value} ${this.name}() {`);
            tmp.append(`    return (${return_value})((this->value >> ${this.low_bit}) & ${ this.bitMask.toString(16) });`);
        }
        tmp.append(`}`);
        return tmp.value;
    }

    setter(register_value_name: string): string {
        let tmp = new cstring();
        
        let return_value = '';
        if(this.enumerations.length){
            return_value = `e${cstring.capitalizeFirstLetter(this.enumerations[0].group)}`;
        }

        tmp.append(`/// @brief ${this.description}`);
        tmp.append(`/// @return ${return_value}`)

        if(this.isBool){
            tmp.append(`__INLINE ${register_value_name}& ${this.name}(bool value) {`);
            tmp.append(`    value ? SetBit(${this.low_bit}) : ClearBit(${this.low_bit});`);
        }else{
            tmp.append(`__INLINE ${register_value_name}& ${this.name}(${return_value} value) {`);
            tmp.append(`    this->value &= ~(((uint32_t)value & 0x${ this.bitMask.toString(16) }) << ${this.low_bit});`);
            tmp.append(`    this->value |= ((uint32_t)value & 0x${ this.bitMask.toString(16) }) << ${this.low_bit};`);
        }

        tmp.append(`    return *this;`)
        tmp.append(`}`);
        return tmp.value;
    }

    enumerationToCPP(): string {
        let tmp = new cstring();

        tmp.append(`enum class e${cstring.capitalizeFirstLetter(this.name)} {`);

        this.enumerations.forEach( e => {
            tmp.append(`${e.name} = ${e.value}, /// ${e.description}`);
        });

        tmp.append(`};`)

        return tmp.toString();
    }

    toCpp(register_value_name: string, address_width: string) {
        let tmp = new cstring();

        switch(this.access){
            case Access.Read:
                tmp.append(this.getter());
                break;
            case Access.Write:
                tmp.append(this.setter(register_value_name));
                break;
            case Access.ReadWrite:
                tmp.append(this.getter());
                tmp.append(this.setter(register_value_name), false);
                break;
        }
        
        return tmp.toString();
    }
}