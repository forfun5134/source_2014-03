/**
 * KNCSDK SerializeTag constants matching KNCSDK/Include/Serializer/SerDefs.h.
 * Uses `as const` + union type to satisfy TypeScript 7.1 `erasableSyntaxOnly`.
 */
export const SerializeTag = {
  // numeric
  eTAG_CHAR: 0,
  eTAG_WCHAR: 1,
  eTAG_UCHAR: 2,
  eTAG_SHORT: 3,
  eTAG_USHORT: 4,
  eTAG_INT: 5,
  eTAG_DWORD: 6,
  eTAG_INT64: 7,
  eTAG_UINT64: 8,
  eTAG_FLOAT: 9,
  eTAG_DOUBLE: 10,
  eTAG_BOOL: 11,

  // array-like types
  eTAG_STRING: 12,
  eTAG_WSTRING: 13,
  eTAG_ARRAY: 14,
  eTAG_RAWBYTES: 15,

  // STL containers
  eTAG_PAIR: 16,
  eTAG_VECTOR: 17,
  eTAG_LIST: 18,
  eTAG_DEQUE: 19,
  eTAG_SET: 20,
  eTAG_MULTISET: 21,
  eTAG_MAP: 22,
  eTAG_MULTIMAP: 23,

  // builtin classes
  eTAG_BUFFER: 24,
  eTAG_KEYEDSERIALIZER: 25,

  // any user-defined class
  eTAG_USERCLASS: 26,

  // sentinel
  eTAG_LAST: 27,
} as const;

export type SerializeTag = (typeof SerializeTag)[keyof typeof SerializeTag];
