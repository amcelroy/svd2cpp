import { cstring } from './cstring';
import { MCU } from './mcu';
import { Register } from './register'

export class Peripheral {
    name: string = '';
    description: string = '';
    group: string = '';
    baseAddress: string = '';
    interrupt: Map<string, number> = new Map<string, number>();
    registers: Array<Register> = [];

    comments: string = '';

    copy(name: string, base_address: string, interrupt: any = {}) {
        let clone = new Peripheral();
        clone.name = name;
        clone.baseAddress = base_address;
        clone.group = this.group;
        clone.comments = this.comments;
        this.registers.forEach( reg => {
            clone.registers.push(reg);
        });

        clone.description = this.description.replace(this.name, clone.name);

        if(Object.keys(interrupt).length){
            clone.parseInterrupts(interrupt);
        }else{
            console.log(`No interrupts found for ${name}`);
        }

        return clone;
    }

    addInterrupt(name: string, value: number){
        this.interrupt.set(
            name, 
            value
        );
    }

    parseInterrupts(json: any){
        let ints = json as any[];

        if(ints.length > 1){
            ints.forEach( (json_int: any) => {
                this.addInterrupt(
                    json_int['name'], 
                    json_int['value']
                );
            });
        }else{
            this.addInterrupt(
                json['name'], 
                json['value']
            );
        }
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
            let address = json['baseAddress'] as number;
            this.baseAddress = '0x' + address.toString(16);
        }

        if(json['interrupt']){
            this.parseInterrupts(json['interrupt']);
        }

        if(json['registers']){
            (json['registers']['register'] as Array<any>).forEach( register => {
                this.registers.push(new Register(address_type, value_type, this.baseAddress).parse(register));
            });
        }

        return this;
    }
}