#include <cstdint>
#include "cmsis_armclang.h"

template<typename T>
class RegisterValue {
    protected:
    static T value = 0;

    public: 
    __STATIC_FORCEINLINE RegisterValue<T>& SetBit(T bit) {
        this.value |= (1 << bit);
        return *this;
    }

    __STATIC_FORCEINLINE RegisterValue<T>& ClearBit(T bit) {
        this.value &= ~(1 << bit);
        return *this;
    }

    __STATIC_FORCEINLINE bool GetBit(T bit){
        return (this.value >> bit);
    }
};

template<uintptr_t address, typename T>
class Register {

protected:
    static constexpr reg_addr_t Address = address;

    static RegisterValue<T> value;

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

    __STATIC_FORCEINLINE RegisterValue<T> Value(){
        return value;
    }

    __STATIC_FORCEINLINE void Write(T value){
        this->value = value;
        this->Write();
    }

    __STATIC_FORCEINLINE void Write() {
        *reinterpret_cast<volatile T*>(Address) = value;
    }

    __STATIC_FORCEINLINE T Read(){
        return *reinterpret_cast<volatile T*>(Address)
    }
};