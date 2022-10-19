#include <cstdint>
//#include "cmsis_armclang.h"

#ifndef __STATIC_INLINE
#define __STATIC_INLINE static inline
#endif

template<typename Taddress, volatile Taddress *address, typename T>
class Register {

private:
    T value = 0;

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
        *address = value;
    }

    inline Register Read(){
        return *base_address;
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