// UidType.h — 64-bit UID 佈局（與原 KncUidType.h/.cpp 相容）
//
// 版面（預設 INT/通用模式，8 bytes）：
//   bits 63    : 0=一般UID / 1=暫時UID（GetTempUID 會設 bit62|bit63? 見下）
//   bits 56..62: ServerGroupID（6 bits）
//   bits 48..55: ServerID     （8 bits）
//   bits 40..47: ReservedID   （8 bits）
//   bits  0..39: Pure UID     （40 bits）
//
// SERV_COUNTRY_CN / SERV_COUNTRY_US 模式（EXTEND_SERVER_GROUP_MASK）：
//   bits 52..61: ServerGroupID（10 bits）
//   bits 44..51: ServerID     （8 bits）
//   bits 36..43: ReservedID   （8 bits）
//   bits  0..35: Pure UID     （36 bits）
#pragma once

#include <cstdint>

namespace x2 {

using UidType = int64_t;

// V2 預設：INT（非 EXTEND_SERVER_GROUP_MASK）。可用 X2_EXTEND_SERVER_GROUP_MASK 切換。
#if defined(X2_EXTEND_SERVER_GROUP_MASK)
inline constexpr UidType kPureUidMask    = 0x0000000FFFFFFFFF; // 36 bits
inline constexpr int     kServerGroupBits = 10;
inline constexpr int     kServerGroupShift = 52;
inline constexpr UidType kServerGroupMask = 0x3FF;
inline constexpr int     kServerIDShift  = 44;
inline constexpr int     kReservedIDShift = 36;
#else
inline constexpr UidType kPureUidMask    = 0x000000FFFFFFFFFF; // 40 bits
inline constexpr int     kServerGroupBits = 6;
inline constexpr int     kServerGroupShift = 56;
inline constexpr UidType kServerGroupMask = 0x3F;
inline constexpr int     kServerIDShift  = 48;
inline constexpr int     kReservedIDShift = 40;
#endif
inline constexpr UidType kServerIDMask   = 0xFF;
inline constexpr UidType kReservedIDMask = 0xFF;

namespace uid {

UidType ExtractPureUID(UidType id);
UidType ExtractServerGroupID(UidType id);
UidType ExtractServerID(UidType id);
UidType ExtractReservedID(UidType id);
UidType ExtractCodeID(UidType id);   // server(8b) | reserved(8b) → 16 bits
void    SetPureUID(UidType& dst, UidType src);
void    SetServerGroupID(UidType& dst, UidType src);
void    SetServerID(UidType& dst, UidType src);
void    SetReservedID(UidType& dst, UidType src);
void    SetCodeID(UidType& dst, UidType src);
uint32_t Die32();
UidType  GetTempUID();   // bit62(0x4000...) 暫時UID 旗標
void     SetTempUID(UidType& id);

} // namespace uid
} // namespace x2
