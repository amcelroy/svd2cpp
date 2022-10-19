export class NVIC {

    

    base_address: string;
    interrupts: Map<string, number> = new Map<string, number>();
    priority_bits: number = 3;

    constructor(base_address: string) {
        this.base_address = base_address;
    }

    setPriorityBits(priority_bits: number) {
        this.priority_bits = priority_bits;
    }

}