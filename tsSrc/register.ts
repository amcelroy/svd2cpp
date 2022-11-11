import { cstring } from './cstring';
import { Access, Field } from './field';
import { Utils } from './utils';

export enum Tags {
    Enum, 
    Register,
    Struct
}

export class Register {
    headers: string = '';
    namespace: string = '';
    access: Access = Access.ReadWrite;
    description: string = '';
    addressOffset: string = '0x0';
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

    parse(json: any) : Register {
        if(json['name']) {
            this.name = json['name'];
        }

        if(json['description']) {
            this.description = json['description'];
        }

        if(json['addressOffset']) {
            let offset = json['addressOffset'] as number;
            if(offset == 0){
                let test = 0;
            }
            this.addressOffset = '0x' + offset.toString(16);
        }

        if(json['fields']) {
            let x = json['fields']['field'] as Array<any>;

            if(x.length === undefined){
                //Don't use Single Field?
                //this.fields.push(new Field().parse(x));
            }else{
                x.forEach( field => {
                    this.fields.push(new Field().parse(field));
                });
            }
        }

        return this;
    }

    registerValueName() {
        return this.name.substring(0, 1) + this.name.substring(1).toLowerCase() + 'Value'
    }

    toCpp(baseAddress: string, address_width: string = "uint32_t", inherited: boolean): Map<Tags, cstring> {
        let register = new cstring();
        let register_struct = new cstring();
        let register_enum = new cstring();
        
        let register_struct_name = address_width; // Use address width if there is nothing specific about the register

        if(this.fields.length){
            register_struct_name = Utils.makeRegisterStructName(this.name);
            // Check if the register is inherited from another peripheral. If it is,
            // don't regenerate the struct value.
            if(inherited == false){
                register_struct.append(`class ${register_struct_name} : public RegisterValue<${address_width}> {`);
                for(const field of this.fields){
                    register_struct.append(field.toCpp(register_struct_name, address_width));
                    if(field.enumerations.length > 0){
                        register_enum.append(field.enumerationToCPP());
                    }
                }
                register_struct.append(`};`);
            }
        }

        register.append(`/// ${this.description}`)
        register.append(`using ${this.name} = Register<${baseAddress} + ${this.addressOffset}, ${register_struct_name}>;`);
        
        let retval = new Map<Tags, cstring>();
        retval.set(Tags.Struct, register_struct);
        retval.set(Tags.Register, register);
        retval.set(Tags.Enum, register_enum);

        return retval;
    }
}