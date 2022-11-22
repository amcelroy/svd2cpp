#pragma once

#include <cstdint>
#include "cmsis_armclang.h"

template<typename T>
struct RegisterValue {

    static inline T value_;

    RegisterValue() {
        value_ = 0;
    }

    RegisterValue(T initial) {
        this->value = initial;
    }

    __INLINE void Set(T value) {
        value_ = value;
    }

    __INLINE T Get() {
        return value_;
    }

    __INLINE RegisterValue<T>& SetBit(T bit) {
        this->value |= (1 << bit);
        return *this;
    }

    __INLINE RegisterValue<T>& ClearBit(T bit) {
        this->value &= ~(1 << bit);
        return *this;
    }

    __INLINE bool GetBit(T bit){
        return (this->value >> bit);
    }
};

template<uintptr_t address, typename T>
class Register {

public:
    static constexpr uintptr_t Address = address;

    static inline RegisterValue<T> value_;

    Register() {
        value_ = RegisterValue<T>(0);
    }

    Register(T value) {
        value_ = value;
    }

    Register(Register &r){
        value_ = r.value_;
    }

    __STATIC_INLINE RegisterValue<T>& Value(){
        return *value_;
    }

    __STATIC_INLINE void Write(T value){
        value_.Set(value);
        Write();
    }

    __STATIC_INLINE void Write() {
        *reinterpret_cast<volatile T*>(Address) = value_.Get();
    }

    __STATIC_INLINE T Read(){
        return *reinterpret_cast<volatile T*>(Address);
    }
};