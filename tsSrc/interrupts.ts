

class Interrupts {
    private static instance: Interrupts;
    
    interrupt_table: Map<string, number> = new Map();

    constructor() {
        if(Interrupts.instance){
            return Interrupts.instance;
        }

        Interrupts.instance = this;
    }

    add(name: string, interrupt: number) {
        this.interrupt_table.set(name, interrupt);
    }
}