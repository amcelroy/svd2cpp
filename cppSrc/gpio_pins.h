#include <cstdint>
#include "gpio.h"

class Pin {
    protected:
        uint32_t pin;

    Pin(uint32_t pin){
        this->pin = pin;
    }
};

class OutputPin final : Pin {
    public:
        void Init(uint32_t args...) {
            #warning Configure OutputPin.Init()
        }

        void Set() {
            #warning Configure OutputPin.Set()
        }

        void Clear() {
            #warning Configure OutputPin.Clear()
        }
};

class InputPin final : Pin {
    public:
        void Init(uint32_t args...) {
            #warning Configure InputPin.Init()
        }

        bool Get() {
            #warning Configure InputPin.Get()
            return false;
        }
};

class PeripheralPin final : Pin {
    public:
        void Init(uint32_t args...) {
            #warning Configure InputPin.Init()
        }
};