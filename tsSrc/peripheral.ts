import { cstring } from './cstring';
import { MCU } from './mcu';
import { Register, Tags } from './register'

export class Peripheral {
    name: string = '';
    description: string = '';
    group: string = '';
    baseAddress: string = '';
    interrupt: Map<string, number> = new Map<string, number>();
    registers: Array<Register> = [];
    inherited: boolean = false;

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

        clone.inherited = true;

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

    toCpp(inheritences: string, address_width: string) {
        let cl = new cstring();

        if(this.interrupt.size > 0){

        }

        let registers = new cstring();
        let structs = new cstring();
        let enums = new cstring();

        this.registers.forEach( r => {
            let register_details = r.toCpp(this.baseAddress, address_width, this.inherited);
            registers.append(register_details.get(Tags.Register)?.toString());
            structs.append(register_details.get(Tags.Struct)?.toString());
            enums.append(register_details.get(Tags.Enum)?.toString());
        });

        cl.append(enums.toString());
        cl.append(structs.toString());

        if(inheritences == ""){
            cl.append(`class ${this.name} final : public Peripheral<${this.baseAddress}> {`)
        }else{
            cl.append(`class ${this.name} final : public Peripheral<${this.baseAddress}>, ${inheritences} {`)
        }
        
        cl.append(registers.toString(), false);

        cl.append(`};`);
        return cl.toString();
    }
}