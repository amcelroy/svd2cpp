cmake_minimum_required(VERSION 3.10)

set(SRC_FILES 
    "./test/main.cpp"
)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_BUILD_TYPE Debug)

include_directories(".")

project(test)

add_executable(test ${SRC_FILES})

