cmake_minimum_required(VERSION 3.16)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 14)


project (libwebview)

add_definitions(-DNAPI_VERSION=8)

include_directories(${CMAKE_JS_INC})
include_directories("include/")

file(GLOB SOURCE_FILES "src/*.cxx")

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()


include(FetchContent)

FetchContent_Declare(
    webview
    GIT_REPOSITORY https://github.com/webview/webview
    GIT_TAG 0.12.0)
FetchContent_MakeAvailable(webview)

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} webview::core)

# Set compile definitions based on environment variables
if(CMAKE_SYSTEM_NAME MATCHES "Linux")
  if(DEFINED ENV{WEBVIEW_WEBKITGTK_API})
      message(STATUS "WEBVIEW_WEBKITGTK_API is set to $ENV{WEBVIEW_WEBKITGTK_API}")
      target_compile_definitions(${PROJECT_NAME} PRIVATE 
          CDWEBVIEW_WEBKITGTK_API="$ENV{WEBVIEW_WEBKITGTK_API}"
      )
  endif()
elseif(CMAKE_SYSTEM_NAME MATCHES "Windows")
  if(DEFINED ENV{WEBVIEW_MSWEBVIEW2_VERSION})
      message(STATUS "WEBVIEW_MSWEBVIEW2_VERSION is set to $ENV{WEBVIEW_MSWEBVIEW2_VERSION}")
      target_compile_definitions(${PROJECT_NAME} PRIVATE 
          CDWEBVIEW_MSWEBVIEW2_VERSION="$ENV{WEBVIEW_MSWEBVIEW2_VERSION}"
      )
  endif()
  if(DEFINED ENV{WEBVIEW_USE_BUILTIN_MSWEBVIEW2})
    message(STATUS "WEBVIEW_USE_BUILTIN_MSWEBVIEW2 is set to $ENV{WEBVIEW_USE_BUILTIN_MSWEBVIEW2}")
    target_compile_definitions(${PROJECT_NAME} PRIVATE 
        CDWEBVIEW_USE_BUILTIN_MSWEBVIEW2="$ENV{WEBVIEW_USE_BUILTIN_MSWEBVIEW2}"
    )
endif()
endif()