#include <cstdint>
#include "cmsis_armclang.h"

template<typename T>
class RegisterValue {
    T value = 0;

    public: 
    __INLINE RegisterValue<T>& SetBit(T bit) {
        this.value |= (1 << bit);
        return *this;
    }

    __INLINE RegisterValue<T>& ClearBit(T bit) {
        this.value &= ~(1 << bit);
        return *this;
    }

    __INLINE bool GetBit(T bit){
        return (this.value >> bit);
    }
};

template<uintptr_t address, typename T>
class Register {

private:
    static constexpr reg_addr_t Address = address;

    RegisterValue<T> value;

public:
    Register() {
        value = 0;
        this->Write(value);
    }

    Register(T value) {
        this->Write(value);
    }

    Register(Register &r){
        this->value = r.value;
    }

    __STATIC_INLINE RegisterValue<T> Value(){
        return value;
    }

    __STATIC_INLINE void Write(T value){
        this->value = value;
        this->Write();
    }

    __STATIC_INLINE void Write() {
        *reinterpret_cast<volatile T*>(Address) = value;
    }

    __STATIC_INLINE T Read(){
        return *reinterpret_cast<volatile T*>(Address)
    }
};