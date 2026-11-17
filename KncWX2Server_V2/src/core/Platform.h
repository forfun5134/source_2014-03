// Platform.h — 平台檢測與基本類型別名（V2 全新實作，不沿用 windows.h 依賴）
#pragma once

#if defined(_WIN32)
#  define X2_PLATFORM_WINDOWS 1
#else
#  define X2_PLATFORM_POSIX 1
#endif

#if defined(_MSC_VER)
#  include <sal.h>
#  define X2_ALWAYS_INLINE __forceinline
#else
#  define X2_ALWAYS_INLINE inline __attribute__((always_inline))
#endif

namespace x2 {

using byte = unsigned char;

} // namespace x2
