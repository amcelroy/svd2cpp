#include <cstdint>
//#include "cmsis_armclang.h"

#ifndef __STATIC_INLINE
#define __STATIC_INLINE static inline
#endif

template<uintptr_t address, typename T>
class Register {

private:
   static constexpr reg_addr_t Address = address;

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

    inline T Value(){
        return value;
    }

    inline Register Write(T value){
        this->value = value;
        this->Write();
    }

    inline Register Write() {
        *reinterpret_cast<volatile T*>(Address) = value;
    }

    inline Register Read(){
        return *reinterpret_cast<volatile T*>(Address)
    }

    inline Register SetBit(T bit) {
        value |= (1 << bit);
        return *this;
    }

    inline Register ClearBit(T bit) {
        value &= ~(1 << bit);
        return *this;
    }

    inline bool GetBit(T bit){
        return (value >> bit);
    }
};