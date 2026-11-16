// Auto-generated from KncWX2Server/Common/EventID_System.h & OnlyGlobal/EventID_System_Global.h

export const EventIDSystem = {
  E_HEART_BEAT: 0,
  /** server -> client connect 요청을 받은 곳에 새로운 보안키를 전달. */
  E_ACCEPT_CONNECTION_NOT: 1,
  E_CONNECTION_LOST_NOT: 2,
  /** server -> client UDP 패킷에 찍힌 포트번호를 TCP로 알려줌. */
  E_UDP_PORT_NOT: 3,
  E_DISABLE_HB_CHECK_REQ: 4,
  E_LOG_NOT: 5,
  E_RESERVE_DESTROY: 6,
  E_TOOL_GET_CCU_INFO_REQ: 7,
  E_TOOL_GET_CCU_INFO_ACK: 8,
  E_TOOL_CHECK_LOGIN_REQ: 9,
  E_TOOL_CHECK_LOGIN_ACK: 10,
  E_TOOL_SERVER_LIST_REQ: 11,
  E_TOOL_SERVER_LIST_ACK: 12,
  E_CHECK_SEQUENCE_COUNT_NOT: 13,
  E_UDP_RELAY_SERVER_CHECK_PACKET_NOT: 14,
  E_CONNECT_RELAY_ACK: 15,
  E_CHECK_DDOS_GUARD_REQ: 16,
  E_CHECK_DDOS_GUARD_ACK: 17,
  E_CH_CONNECTION_LOST_FOR_DDOS_GUARD_NOT: 18,
  E_GS_CONNECTION_LOST_FOR_DDOS_GUARD_NOT: 19,
  E_SYSTEM_EVENT_ID_END: 20,
} as const;

export type EventIDSystemName = keyof typeof EventIDSystem;
export type EventIDSystem = (typeof EventIDSystem)[EventIDSystemName];

export const E_SYSTEM_EVENT_ID_END = 20 as const;
