import { cstring } from './cstring';
import { Register } from './register'

export class Peripheral {
    name: string = '';
    description: string = '';
    group: string = '';
    baseAddress: string = '';
    interrupt: number = -1;
    registers: Array<Register> = [];

    comments: string = '';

    copy(name: string, base_address: string, interrupt: any = {}) {
        let clone = new Peripheral();
        clone.name = name;
        clone.baseAddress = base_address;
        clone.group = this.group;
        clone.interrupt = this.interrupt;
        clone.comments = this.comments;
        this.registers.forEach( reg => {
            clone.registers.push(reg);
        });

        clone.description = this.description.replace(this.name, clone.name);

        if(Object.keys(interrupt).length){
            clone.interrupt = interrupt['value'];
        }

        return clone;
    }

    parse(json: any, address_type: string = 'uint32_t', value_type: string = 'uint32_t'): Peripheral {
        if(json['name']){
            this.name = json['name'];
        }

        if(json['description']){
            this.description = json['description'];
        }

        if(json['groupName']){
            this.group = json['groupName'];
        }

        if(json['baseAddress']){
            this.baseAddress = json['baseAddress'];
        }

        if(json['interrupt']){
            this.interrupt = json['interrupt']['value'];
        }

        if(json['registers']){
            (json['registers']['register'] as Array<any>).forEach( register => {
                this.registers.push(new Register(address_type, value_type, this.baseAddress).parse(register));
            });
        }

        return this;
    }

    toCPP() {
        let tmp = new cstring();

        //TODO: Create new file here

        tmp.append(`#include "register.h"`);
        tmp.append(`namespace ${this.group.toLowerCase()} {`);

        tmp.append(`namespace ${this.name.toLowerCase()} {`);

        this.registers.forEach(register => {
            tmp.append(register.toCPP());
        });

        tmp.append(`}`);
        tmp.append(`}`);

        console.log(tmp.value);

        let x = 0;
    }
}