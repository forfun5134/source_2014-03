#!/usr/bin/env python3
"""
Deterministic code generator migrating:
  - KncWX2Server/Common/ServerDefine.h & OnlyGlobal/ServerDefine/*.h
  - KncWX2Server/Common/EventID_System.h & OnlyGlobal/EventID_System_Global.h
  - KncWX2Server/Common/EventID_Client.h & OnlyGlobal/EventID_Client_Global.h
  - KncWX2Server/Common/CommonPacket.{h,cpp}
  - KncWX2Server/Common/OnlyGlobal/Packet/CommonPacket_Global.{h,cpp}
  - KncWX2Server/Common/ClientPacket.{h,cpp}
  - KncWX2Server/Common/OnlyGlobal/Packet/ClientPacket_Global.{h,cpp}
into TypeScript 7.1 Beta (`erasableSyntaxOnly`, `verbatimModuleSyntax`, `strict`).
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]
OUT_ROOT = REPO_ROOT / "protocol-ts" / "src"

CPP_COMMON_DIR = REPO_ROOT / "KncWX2Server" / "Common"
SERVER_DEFINE_H = CPP_COMMON_DIR / "ServerDefine.h"
SERVER_DEFINE_GLOBAL_DIR = CPP_COMMON_DIR / "OnlyGlobal" / "ServerDefine"

EVENT_ID_SYSTEM_H = CPP_COMMON_DIR / "EventID_System.h"
EVENT_ID_SYSTEM_GLOBAL_H = CPP_COMMON_DIR / "OnlyGlobal" / "EventID_System_Global.h"
EVENT_ID_CLIENT_H = CPP_COMMON_DIR / "EventID_Client.h"
EVENT_ID_CLIENT_GLOBAL_H = CPP_COMMON_DIR / "OnlyGlobal" / "EventID_Client_Global.h"

PACKET_SPECS = [
    (
        "common-packet",
        CPP_COMMON_DIR / "CommonPacket.h",
        CPP_COMMON_DIR / "CommonPacket.cpp",
    ),
    (
        "common-packet-global",
        CPP_COMMON_DIR / "OnlyGlobal" / "Packet" / "CommonPacket_Global.h",
        CPP_COMMON_DIR / "OnlyGlobal" / "Packet" / "CommonPacket_Global.cpp",
    ),
    (
        "client-packet",
        CPP_COMMON_DIR / "ClientPacket.h",
        CPP_COMMON_DIR / "ClientPacket.cpp",
    ),
    (
        "client-packet-global",
        CPP_COMMON_DIR / "OnlyGlobal" / "Packet" / "ClientPacket_Global.h",
        CPP_COMMON_DIR / "OnlyGlobal" / "Packet" / "ClientPacket_Global.cpp",
    ),
]


def read_cp949(path: Path) -> str:
    return path.read_bytes().decode("cp949", errors="replace").replace("\r\n", "\n").replace("\r", "\n")


def strip_comments_keep_lines(text: str, extract_line_comments: bool = False) -> tuple[str, list[str]]:
    out: list[str] = []
    line_comments: dict[int, str] = {}
    i = 0
    n = len(text)
    line_no = 1
    while i < n:
        ch = text[i]
        if ch == "\n":
            out.append("\n")
            line_no += 1
            i += 1
        elif text[i : i + 2] == "//":
            j = text.find("\n", i)
            if j == -1:
                if extract_line_comments:
                    line_comments[line_no] = text[i + 2 :].strip()
                break
            if extract_line_comments:
                c = text[i + 2 : j].strip()
                if c:
                    line_comments[line_no] = c
            out.append("\n")
            line_no += 1
            i = j + 1
        elif text[i : i + 2] == "/*":
            j = text.find("*/", i + 2)
            if j == -1:
                break
            nl = text[i : j + 2].count("\n")
            out.append("\n" * nl)
            line_no += nl
            i = j + 2
        elif ch == '"':
            j = i + 1
            while j < n and text[j] != '"':
                if text[j] == "\\":
                    j += 2
                else:
                    if text[j] == "\n":
                        line_no += 1
                    j += 1
            out.append(text[i : j + 1])
            i = j + 1
        else:
            out.append(ch)
            i += 1
    comments_by_line = [line_comments.get(k, "") for k in range(1, line_no + 1)]
    return "".join(out), comments_by_line


# ==============================================================================
# 1. Preprocessor Condition AST
# ==============================================================================

Cond = tuple[Any, ...]
TRUE_COND: Cond = ("true",)
FALSE_COND: Cond = ("false",)


def cond_not(c: Cond) -> Cond:
    if c == TRUE_COND:
        return FALSE_COND
    if c == FALSE_COND:
        return TRUE_COND
    if c[0] == "not":
        return c[1]
    return ("not", c)


def cond_and(*items: Cond) -> Cond:
    flat: list[Cond] = []
    for it in items:
        if it == FALSE_COND:
            return FALSE_COND
        if it == TRUE_COND:
            continue
        if it[0] == "and":
            for sub in it[1]:
                if sub not in flat:
                    flat.append(sub)
        else:
            if it not in flat:
                flat.append(it)
    if not flat:
        return TRUE_COND
    if len(flat) == 1:
        return flat[0]
    # Check trivial contradiction x && !x
    for item in flat:
        if cond_not(item) in flat:
            return FALSE_COND
    return ("and", tuple(flat))


def cond_or(*items: Cond) -> Cond:
    flat: list[Cond] = []
    for it in items:
        if it == TRUE_COND:
            return TRUE_COND
        if it == FALSE_COND:
            continue
        if it[0] == "or":
            for sub in it[1]:
                if sub not in flat:
                    flat.append(sub)
        else:
            if it not in flat:
                flat.append(it)
    if not flat:
        return FALSE_COND
    if len(flat) == 1:
        return flat[0]
    return ("or", tuple(flat))


def parse_if_expr(expr: str) -> Cond:
    tokens = re.findall(r"defined\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)|defined\s+([A-Za-z_][A-Za-z0-9_]*)|&&|\|\||!|\(|\)|[A-Za-z_][A-Za-z0-9_]*|[0-9]+", expr)
    raw_tokens: list[tuple[str, str]] = []
    # Re-tokenize cleanly with regex scanner
    pos = 0
    s = expr.strip()
    lex: list[str] = []
    while pos < len(s):
        if s[pos].isspace():
            pos += 1
            continue
        m_def = re.match(r"defined\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)", s[pos:])
        if m_def:
            lex.append(f"DEF:{m_def.group(1)}")
            pos += m_def.end()
            continue
        m_def2 = re.match(r"defined\s+([A-Za-z_][A-Za-z0-9_]*)", s[pos:])
        if m_def2:
            lex.append(f"DEF:{m_def2.group(1)}")
            pos += m_def2.end()
            continue
        if s[pos : pos + 2] in ("&&", "||"):
            lex.append(s[pos : pos + 2])
            pos += 2
            continue
        if s[pos] in ("!", "(", ")"):
            lex.append(s[pos])
            pos += 1
            continue
        m_id = re.match(r"[A-Za-z_][A-Za-z0-9_]*", s[pos:])
        if m_id:
            lex.append(f"DEF:{m_id.group(0)}")
            pos += m_id.end()
            continue
        m_num = re.match(r"[0-9]+", s[pos:])
        if m_num:
            lex.append(f"NUM:{m_num.group(0)}")
            pos += m_num.end()
            continue
        raise ValueError(f"Unsupported #if expression token in: {expr!r} at {s[pos:]!r}")

    idx = 0

    def peek() -> str | None:
        return lex[idx] if idx < len(lex) else None

    def consume() -> str:
        nonlocal idx
        t = lex[idx]
        idx += 1
        return t

    def parse_or() -> Cond:
        left = parse_and()
        while peek() == "||":
            consume()
            right = parse_and()
            left = cond_or(left, right)
        return left

    def parse_and() -> Cond:
        left = parse_unary()
        while peek() == "&&":
            consume()
            right = parse_unary()
            left = cond_and(left, right)
        return left

    def parse_unary() -> Cond:
        if peek() == "!":
            consume()
            return cond_not(parse_unary())
        if peek() == "(":
            consume()
            inner = parse_or()
            if peek() == ")":
                consume()
            return inner
        tok = consume()
        if tok.startswith("DEF:"):
            return ("sym", tok[4:])
        if tok.startswith("NUM:"):
            return TRUE_COND if int(tok[4:]) != 0 else FALSE_COND
        raise ValueError(f"Unexpected token {tok!r} in {expr!r}")

    if not lex:
        return TRUE_COND
    return parse_or()


def eval_cond(c: Cond, flags: dict[str, bool]) -> bool:
    kind = c[0]
    if kind == "true":
        return True
    if kind == "false":
        return False
    if kind == "sym":
        return bool(flags.get(c[1], False))
    if kind == "not":
        return not eval_cond(c[1], flags)
    if kind == "and":
        return all(eval_cond(sub, flags) for sub in c[1])
    if kind == "or":
        return any(eval_cond(sub, flags) for sub in c[1])
    raise ValueError(f"Unknown cond node: {c!r}")


def collect_cond_syms(c: Cond, out: set[str]) -> None:
    kind = c[0]
    if kind == "sym":
        out.add(c[1])
    elif kind == "not":
        collect_cond_syms(c[1], out)
    elif kind in ("and", "or"):
        for sub in c[1]:
            collect_cond_syms(sub, out)


def cond_to_ts(c: Cond, var: str = "f") -> str:
    kind = c[0]
    if kind == "true":
        return "true"
    if kind == "false":
        return "false"
    if kind == "sym":
        return f"Boolean({var}.{c[1]})"
    if kind == "not":
        sub = c[1]
        if sub[0] == "sym":
            return f"!{var}.{sub[1]}"
        return f"!({cond_to_ts(sub, var)})"
    if kind == "and":
        parts = []
        for sub in c[1]:
            s = cond_to_ts(sub, var)
            if sub[0] == "or":
                s = f"({s})"
            elif sub[0] == "sym":
                s = f"{var}.{sub[1]}"
            parts.append(s)
        return " && ".join(parts)
    if kind == "or":
        parts = []
        for sub in c[1]:
            s = cond_to_ts(sub, var)
            if sub[0] == "sym":
                s = f"{var}.{sub[1]}"
            parts.append(s)
        return " || ".join(parts)
    raise ValueError(f"Unknown cond node: {c!r}")


def cond_to_readable(c: Cond) -> str:
    kind = c[0]
    if kind == "true":
        return "always"
    if kind == "false":
        return "never"
    if kind == "sym":
        return c[1]
    if kind == "not":
        sub = c[1]
        if sub[0] == "sym":
            return f"!{sub[1]}"
        return f"!({cond_to_readable(sub)})"
    if kind == "and":
        return " && ".join(cond_to_readable(s) for s in c[1])
    if kind == "or":
        return " || ".join(cond_to_readable(s) for s in c[1])
    return str(c)


# ==============================================================================
# 2. ServerDefine Preprocessor Evaluator
# ==============================================================================

def eval_server_define(initial_defines: dict[str, bool], skip_global_common: bool = False) -> dict[str, bool]:
    macros: dict[str, bool] = dict(initial_defines)

    def process_file(path: Path) -> None:
        raw = read_cp949(path)
        clean, _ = strip_comments_keep_lines(raw)
        clean = clean.replace("\\\n", " ")
        # stack entries: (active_branch_taken, currently_active)
        stack: list[list[bool]] = []

        def is_active() -> bool:
            return all(frame[1] for frame in stack)

        for line in clean.splitlines():
            s = line.strip()
            if not s.startswith("#"):
                continue
            m = re.match(r"^#\s*([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$", s)
            if not m:
                continue
            dir_name, rest = m.group(1), m.group(2).strip()
            if dir_name == "ifdef":
                sym = rest.split()[0]
                parent_ok = is_active()
                cond_val = bool(macros.get(sym, False))
                taken = parent_ok and cond_val
                stack.append([taken, taken])
            elif dir_name == "ifndef":
                sym = rest.split()[0]
                parent_ok = is_active()
                cond_val = not bool(macros.get(sym, False))
                taken = parent_ok and cond_val
                stack.append([taken, taken])
            elif dir_name == "if":
                parent_ok = is_active()
                cond_val = eval_cond(parse_if_expr(rest), macros)
                taken = parent_ok and cond_val
                stack.append([taken, taken])
            elif dir_name == "elif":
                parent_ok = all(frame[1] for frame in stack[:-1])
                already = stack[-1][0]
                cond_val = eval_cond(parse_if_expr(rest), macros)
                active_now = parent_ok and (not already) and cond_val
                stack[-1][0] = already or active_now
                stack[-1][1] = active_now
            elif dir_name == "else":
                parent_ok = all(frame[1] for frame in stack[:-1])
                already = stack[-1][0]
                active_now = parent_ok and (not already)
                stack[-1][0] = True
                stack[-1][1] = active_now
            elif dir_name == "endif":
                stack.pop()
            elif not is_active():
                continue
            elif dir_name == "define":
                sym = rest.split()[0].split("(")[0]
                if sym in ("LINE1", "LINE", "NOTE", "ELSE_MESSAGE"):
                    continue
                if skip_global_common and sym == "SERV_GLOBAL_COMMON":
                    continue
                macros[sym] = True
            elif dir_name == "undef":
                sym = rest.split()[0]
                macros[sym] = False
            elif dir_name == "include":
                inc_m = re.match(r'^"([^"]+)"', rest)
                if inc_m:
                    inc_path = path.parent / inc_m.group(1)
                    if not inc_path.exists():
                        inc_path = CPP_COMMON_DIR / inc_m.group(1)
                    if inc_path.exists():
                        process_file(inc_path)

    process_file(SERVER_DEFINE_H)
    return macros


PRESET_CONFIGS: list[tuple[str, dict[str, bool], bool]] = [
    ("DEFAULT", {}, False),
    ("KR", {}, True),
    ("TW", {"SERV_COUNTRY_TW": True, "CLIENT_COUNTRY_TW": True}, False),
    ("HK", {"SERV_COUNTRY_HK": True, "CLIENT_COUNTRY_HK": True}, False),
    ("TWHK", {"SERV_COUNTRY_TWHK": True}, False),
    ("JP", {"SERV_COUNTRY_JP": True, "CLIENT_COUNTRY_JP": True}, False),
    ("EU", {"SERV_COUNTRY_EU": True, "CLIENT_COUNTRY_EU": True}, False),
    ("US", {"SERV_COUNTRY_US": True, "CLIENT_COUNTRY_US": True}, False),
    ("CN", {"SERV_COUNTRY_CN": True, "CLIENT_COUNTRY_CN": True}, False),
    ("TH", {"SERV_COUNTRY_TH": True, "CLIENT_COUNTRY_TH": True}, False),
    ("ID", {"SERV_COUNTRY_ID": True, "CLIENT_COUNTRY_ID": True}, False),
    ("BR", {"SERV_COUNTRY_BR": True, "CLIENT_COUNTRY_BR": True}, False),
    ("PH", {"SERV_COUNTRY_PH": True, "CLIENT_COUNTRY_PH": True}, False),
    ("IN", {"SERV_COUNTRY_IN": True, "CLIENT_COUNTRY_IN": True}, False),
]


# ==============================================================================
# 3. EventID Parser
# ==============================================================================

@dataclass
class EventIdEntry:
    name: str
    value: int
    source: str
    comment: str
    explicit_value: str | None = None
    flag_hint: str | None = None


def parse_event_file(path: Path) -> list[tuple[str, str, str | None, str]]:
    """Returns list of (name, explicit_expr_or_empty, flag_hint_or_none, comment)."""
    raw = read_cp949(path)
    clean, line_comments = strip_comments_keep_lines(raw, extract_line_comments=True)
    items: list[tuple[str, str, str | None, str]] = []
    skip_never = False
    current_hint: str | None = None
    raw_lines = raw.splitlines()
    for idx, line in enumerate(clean.splitlines(), 1):
        s = line.strip()
        raw_s = raw_lines[idx - 1].strip() if idx - 1 < len(raw_lines) else ""
        if s == "#ifdef __NEVER_DEFINED_MACRO__":
            skip_never = True
            continue
        if skip_never and s == "#endif":
            skip_never = False
            continue
        if skip_never:
            continue
        # Detect commented #ifdef SERV_* hints in Global EventIDs
        hint_m = re.match(r"^//\s*#ifdef\s+([A-Za-z0-9_]+)", raw_s)
        if hint_m:
            current_hint = hint_m.group(1)
        elif re.match(r"^//\s*#endif", raw_s):
            current_hint = None

        for m in re.finditer(r"_ENUM\s*\(\s*([^)]+?)\s*\)", s):
            expr = m.group(1).strip()
            if "=" in expr:
                nm, val = [p.strip() for p in expr.split("=", 1)]
            else:
                nm, val = expr, ""
            comment = line_comments[idx - 1] if idx - 1 < len(line_comments) else ""
            items.append((nm, val, current_hint, comment))
    return items


# ==============================================================================
# 4. C++ Packet Header & Serializer AST Parser
# ==============================================================================

@dataclass
class EnumItem:
    name: str
    expr: str | None
    cond: Cond


@dataclass
class NestedEnum:
    name: str
    items: list[EnumItem]
    cond: Cond


@dataclass
class FieldDecl:
    name: str
    cpp_type: str
    array_size: str | None
    cond: Cond
    default_expr: str | None = None
    synth_from_cpp: bool = False


@dataclass
class LocalTypedef:
    name: str
    cpp_type: str
    cond: Cond


@dataclass
class StructVariant:
    cond: Cond
    fields: list[FieldDecl] = field(default_factory=list)
    enums: list[NestedEnum] = field(default_factory=list)
    static_consts: dict[str, int] = field(default_factory=dict)
    local_typedefs: dict[str, str] = field(default_factory=dict)
    defaults: dict[str, str] = field(default_factory=dict)


@dataclass
class StructDecl:
    name: str
    is_packet: bool
    source_module: str
    variants: list[StructVariant] = field(default_factory=list)
    put_ops: list[tuple[Cond, list[tuple[Cond, str]]]] = field(default_factory=list)
    get_ops: list[tuple[Cond, list[tuple[Cond, str]]]] = field(default_factory=list)
    mixed_typedef_variants: list[tuple[Cond, str]] = field(default_factory=list)


@dataclass
class TopTypedef:
    name: str
    source_module: str
    variants: list[tuple[Cond, str]] = field(default_factory=list)


def strip_cpp_type_qualifiers(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip()
    return t


def parse_header_file(
    module_name: str,
    h_path: Path,
    referenced_macros: set[str],
) -> tuple[list[StructDecl], list[TopTypedef], list[str]]:
    raw = read_cp949(h_path)
    clean, _ = strip_comments_keep_lines(raw)
    lines = clean.splitlines()

    cond_stack: list[tuple[Cond, Cond]] = []  # (cumulative_prev_branches_negated, active_branch_cond)

    def current_cond() -> Cond:
        if not cond_stack:
            return TRUE_COND
        return cond_and(*(frame[1] for frame in cond_stack))

    def handle_preproc(s: str) -> None:
        m = re.match(r"^#\s*([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$", s)
        if not m:
            return
        d, rest = m.group(1), m.group(2).strip()
        if d == "ifdef":
            sym = rest.split()[0]
            referenced_macros.add(sym)
            c = ("sym", sym)
            cond_stack.append((cond_not(c), c))
        elif d == "ifndef":
            sym = rest.split()[0]
            referenced_macros.add(sym)
            c = cond_not(("sym", sym))
            cond_stack.append((cond_not(c), c))
        elif d == "if":
            c = parse_if_expr(rest)
            collect_cond_syms(c, referenced_macros)
            cond_stack.append((cond_not(c), c))
        elif d == "elif":
            c = parse_if_expr(rest)
            collect_cond_syms(c, referenced_macros)
            prev_neg, _ = cond_stack.pop()
            branch = cond_and(prev_neg, c)
            cond_stack.append((cond_and(prev_neg, cond_not(c)), branch))
        elif d == "else":
            prev_neg, _ = cond_stack.pop()
            cond_stack.append((FALSE_COND, prev_neg))
        elif d == "endif":
            cond_stack.pop()

    structs: list[StructDecl] = []
    struct_by_name: dict[str, StructDecl] = {}
    typedefs: list[TopTypedef] = []
    typedef_by_name: dict[str, TopTypedef] = {}
    decl_order: list[tuple[str, str]] = []  # ('struct'|'typedef', name)

    n = len(lines)
    i = 0
    while i < n:
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        if s.startswith("#"):
            handle_preproc(s)
            i += 1
            continue

        m_td = re.match(r"^typedef\s+(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;$", s)
        if m_td:
            src_type = strip_cpp_type_qualifiers(m_td.group(1))
            alias = m_td.group(2)
            c = current_cond()
            if alias not in typedef_by_name:
                td = TopTypedef(alias, module_name, [])
                typedef_by_name[alias] = td
                typedefs.append(td)
                decl_order.append(("typedef", alias))
            typedef_by_name[alias].variants.append((c, src_type))
            i += 1
            continue

        m_decl = re.match(r"^(DECL_DATA|DECL_PACKET)\s*\(\s*([A-Za-z0-9_]+)\s*\)$", s)
        if m_decl:
            kind, raw_name = m_decl.group(1), m_decl.group(2)
            name = ("K" if kind == "DECL_PACKET" else "") + raw_name
            struct_cond = current_cond()
            variant = StructVariant(cond=struct_cond)

            # Advance to opening '{'
            i += 1
            while i < n and "{" not in lines[i]:
                st = lines[i].strip()
                if st.startswith("#"):
                    handle_preproc(st)
                i += 1
            if i >= n:
                break

            # Parse inside struct body tracking braces relative to opening '{'
            brace_depth = lines[i].count("{") - lines[i].count("}")
            i += 1
            pending_tokens: list[str] = []
            pending_cond: Cond | None = None
            in_enum: NestedEnum | None = None
            enum_brace_depth = 0
            in_method_depth = 0
            method_name = ""
            ctor_init_buf: list[str] = []

            def flush_member_stmt(stmt: str, stmt_cond: Cond) -> None:
                stmt = stmt.replace(";", " ").strip()
                stmt = re.sub(r"\s+", " ", stmt)
                if not stmt:
                    return
                if stmt.startswith("typedef "):
                    mtd = re.match(r"^typedef\s+(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)$", stmt)
                    if mtd:
                        variant.local_typedefs[mtd.group(2)] = strip_cpp_type_qualifiers(mtd.group(1))
                    return
                if stmt.startswith("static const int "):
                    msc = re.match(r"^static\s+const\s+int\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([0-9]+)$", stmt)
                    if msc:
                        variant.static_consts[msc.group(1)] = int(msc.group(2))
                    return
                # Skip methods/macros/friends/control flow
                if "(" in stmt or ")" in stmt or "=" in stmt or "{" in stmt or "}" in stmt or stmt.startswith(("return ", "if ", "else")):
                    return
                fm = re.match(r"^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s*\[\s*([^\]]+)\s*\])?$", stmt)
                if fm:
                    cpp_t = strip_cpp_type_qualifiers(fm.group(1))
                    fld_name = fm.group(2)
                    arr_sz = fm.group(3).strip() if fm.group(3) else None
                    variant.fields.append(FieldDecl(fld_name, cpp_t, arr_sz, stmt_cond))

            while i < n and brace_depth > 0:
                line = lines[i]
                st = line.strip()
                if st.startswith("#"):
                    handle_preproc(st)
                    i += 1
                    continue

                if not st:
                    i += 1
                    continue

                # If currently inside a constructor/method body
                if in_method_depth > 0:
                    # Extract assignments `m_x = val;` from constructor or Init/Clear/Initialize/clear
                    if method_name in (name, "Init", "Clear", "clear", "Initialize"):
                        for am in re.finditer(r"\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;={}]+);", st):
                            lhs, rhs = am.group(1), am.group(2).strip()
                            if lhs not in variant.defaults:
                                variant.defaults[lhs] = rhs
                        # Handle `memset`? Check if any memset is used
                    in_method_depth += line.count("{") - line.count("}")
                    i += 1
                    continue

                # Inside a nested enum
                if in_enum is not None:
                    enum_brace_depth += line.count("{") - line.count("}")
                    clean_enum_line = st.replace("{", "").replace("}", "").replace(";", "").strip()
                    if clean_enum_line:
                        for part in clean_enum_line.split(","):
                            p = part.strip()
                            if not p:
                                continue
                            if "=" in p:
                                en, ev = [x.strip() for x in p.split("=", 1)]
                                in_enum.items.append(EnumItem(en, ev, current_cond()))
                            else:
                                in_enum.items.append(EnumItem(p, None, current_cond()))
                    if enum_brace_depth <= 0:
                        variant.enums.append(in_enum)
                        in_enum = None
                    i += 1
                    continue

                # Check start of nested enum at depth == 1
                m_en = re.match(r"^enum\s+([A-Za-z_][A-Za-z0-9_]*)\b(.*)$", st)
                if m_en and brace_depth == 1:
                    en_name = m_en.group(1)
                    rest_en = m_en.group(2)
                    in_enum = NestedEnum(en_name, [], current_cond())
                    enum_brace_depth = line.count("{") - line.count("}")
                    body_inline = rest_en.replace("{", "").replace("}", "").replace(";", "").strip()
                    if body_inline:
                        for part in body_inline.split(","):
                            p = part.strip()
                            if not p:
                                continue
                            if "=" in p:
                                en, ev = [x.strip() for x in p.split("=", 1)]
                                in_enum.items.append(EnumItem(en, ev, current_cond()))
                            else:
                                in_enum.items.append(EnumItem(p, None, current_cond()))
                    if "{" in line and enum_brace_depth <= 0:
                        variant.enums.append(in_enum)
                        in_enum = None
                    i += 1
                    continue

                # Check constructor/method/CON_COPYCON_ASSIGNOP starting at depth 1
                is_ctor_or_method = False
                if brace_depth == 1 and not pending_tokens:
                    if st.startswith("CON_COPYCON_ASSIGNOP") or st.startswith("COPYCON_ASSIGNOP"):
                        is_ctor_or_method = True
                        method_name = "COPYCON"
                    elif re.match(rf"^{re.escape(name)}\s*\(", st) or re.match(
                        r"^(?:static\s+)?(?:(?:unsigned|signed)\s+)?(?:void|bool|int|char|short|long|float|double|UCHAR|USHORT|UINT|DWORD|BYTE|UidType|__int64|INT64|UINT64|std::[^\s]+)\s+[A-Za-z_][A-Za-z0-9_]*\s*\(", st
                    ) or "operator" in st:
                        is_ctor_or_method = True
                        if re.match(rf"^{re.escape(name)}\s*\(", st):
                            method_name = name
                        else:
                            mm = re.search(r"\b(Init|Clear|clear|Initialize)\s*\(", st)
                            method_name = mm.group(1) if mm else "OTHER"

                if is_ctor_or_method:
                    # Handle single-line initializer list `: m_a(0), m_b(false)` across multiple lines until `{` or `;`
                    combined = st
                    d_local = line.count("{") - line.count("}")
                    j = i
                    while d_local == 0 and ";" not in combined and "{" not in combined and j + 1 < n:
                        j += 1
                        nxt = lines[j].strip()
                        if nxt.startswith("#"):
                            handle_preproc(nxt)
                            continue
                        combined += " " + nxt
                        d_local += lines[j].count("{") - lines[j].count("}")
                    if method_name in (name, "Init", "Clear", "clear", "Initialize"):
                        for im in re.finditer(r"[,:]\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(\s*([^()]+?)\s*\)", combined):
                            lhs, rhs = im.group(1), im.group(2).strip()
                            if lhs not in variant.defaults:
                                variant.defaults[lhs] = rhs
                        for am in re.finditer(r"\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([^;={}]+);", combined):
                            lhs, rhs = am.group(1), am.group(2).strip()
                            if lhs not in variant.defaults:
                                variant.defaults[lhs] = rhs
                    if d_local > 0:
                        in_method_depth = d_local
                    i = j + 1
                    continue

                # Check closing brace of struct itself
                delta_b = line.count("{") - line.count("}")
                if brace_depth + delta_b <= 0:
                    brace_depth += delta_b
                    i += 1
                    continue

                # Accumulate field/typedef declaration up to ';'
                if pending_cond is None:
                    pending_cond = current_cond()
                pending_tokens.append(st)
                if ";" in st:
                    full_stmt = " ".join(pending_tokens)
                    flush_member_stmt(full_stmt, pending_cond)
                    pending_tokens = []
                    pending_cond = None
                brace_depth += delta_b
                i += 1

            if name not in struct_by_name:
                sd = StructDecl(name, kind == "DECL_PACKET", module_name)
                struct_by_name[name] = sd
                structs.append(sd)
                decl_order.append(("struct", name))
            struct_by_name[name].variants.append(variant)
            continue

        i += 1

    assert not cond_stack, f"Unbalanced preprocessor stack in {h_path}: {cond_stack}"
    return structs, typedefs, [nm for _, nm in decl_order]


def parse_cpp_file(
    cpp_path: Path,
    referenced_macros: set[str],
) -> dict[str, dict[str, list[tuple[Cond, list[tuple[Cond, str]]]]]]:
    raw = read_cp949(cpp_path)
    clean, _ = strip_comments_keep_lines(raw)
    lines = clean.splitlines()

    cond_stack: list[tuple[Cond, Cond]] = []

    def current_cond() -> Cond:
        if not cond_stack:
            return TRUE_COND
        return cond_and(*(frame[1] for frame in cond_stack))

    def handle_preproc(s: str) -> None:
        m = re.match(r"^#\s*([A-Za-z_][A-Za-z0-9_]*)\s*(.*)$", s)
        if not m:
            return
        d, rest = m.group(1), m.group(2).strip()
        if d == "ifdef":
            sym = rest.split()[0]
            referenced_macros.add(sym)
            c = ("sym", sym)
            cond_stack.append((cond_not(c), c))
        elif d == "ifndef":
            sym = rest.split()[0]
            referenced_macros.add(sym)
            c = cond_not(("sym", sym))
            cond_stack.append((cond_not(c), c))
        elif d == "if":
            c = parse_if_expr(rest)
            collect_cond_syms(c, referenced_macros)
            cond_stack.append((cond_not(c), c))
        elif d == "elif":
            c = parse_if_expr(rest)
            collect_cond_syms(c, referenced_macros)
            prev_neg, _ = cond_stack.pop()
            branch = cond_and(prev_neg, c)
            cond_stack.append((cond_and(prev_neg, cond_not(c)), branch))
        elif d == "else":
            prev_neg, _ = cond_stack.pop()
            cond_stack.append((FALSE_COND, prev_neg))
        elif d == "endif":
            cond_stack.pop()

    # result[struct_name]['PUT'|'GET'] -> list of (outer_cond, [(inner_cond, expr)])
    result: dict[str, dict[str, list[tuple[Cond, list[tuple[Cond, str]]]]]] = {}
    n = len(lines)
    i = 0
    while i < n:
        s = lines[i].strip()
        if s.startswith("#"):
            handle_preproc(s)
            i += 1
            continue
        m = re.match(r"^SERIALIZE_DEFINE_(PUT|GET)\s*\(\s*([A-Za-z0-9_]+)\s*,", s)
        if m:
            kind, name = m.group(1), m.group(2)
            outer_c = current_cond()
            ops: list[tuple[Cond, str]] = []
            while i < n and "{" not in lines[i]:
                st = lines[i].strip()
                if st.startswith("#"):
                    handle_preproc(st)
                i += 1
            if i >= n:
                break
            depth = lines[i].count("{") - lines[i].count("}")
            # check inline body on '{' line
            after_brace = lines[i].split("{", 1)[1]
            for fm in re.finditer(r"\b(?:PUT|GET)\s*\(\s*([^)]+?)\s*\)", after_brace):
                ops.append((current_cond(), fm.group(1).strip()))
            i += 1
            while i < n and depth > 0:
                line = lines[i]
                st = line.strip()
                if st.startswith("#"):
                    handle_preproc(st)
                    i += 1
                    continue
                for fm in re.finditer(r"\b(?:PUT|GET)\s*\(\s*([^)]+?)\s*\)", line):
                    ops.append((current_cond(), fm.group(1).strip()))
                depth += line.count("{") - line.count("}")
                i += 1
            result.setdefault(name, {"PUT": [], "GET": []})[kind].append((outer_c, ops))
            continue
        i += 1

    assert not cond_stack, f"Unbalanced preprocessor stack in {cpp_path}: {cond_stack}"
    return result


# ==============================================================================
# 5. Type Parser & Codegen
# ==============================================================================

SCALAR_MAP: dict[str, tuple[str, str, str, str]] = {
    # cpp -> (ts_type, put_method, get_method, default_val)
    "char": ("Int8", "putInt8", "getInt8", "0"),
    "BYTE": ("UInt8", "putUInt8", "getUInt8", "0"),
    "UCHAR": ("UInt8", "putUInt8", "getUInt8", "0"),
    "UINT8": ("UInt8", "putUInt8", "getUInt8", "0"),
    "byte": ("UInt8", "putUInt8", "getUInt8", "0"),
    "u_char": ("UInt8", "putUInt8", "getUInt8", "0"),
    "unsigned char": ("UInt8", "putUInt8", "getUInt8", "0"),
    "uint8": ("UInt8", "putUInt8", "getUInt8", "0"),
    "short": ("Int16", "putInt16", "getInt16", "0"),
    "USHORT": ("UInt16", "putUInt16", "getUInt16", "0"),
    "u_short": ("UInt16", "putUInt16", "getUInt16", "0"),
    "unsigned short": ("UInt16", "putUInt16", "getUInt16", "0"),
    "uint16": ("UInt16", "putUInt16", "getUInt16", "0"),
    "int": ("Int32", "putInt32", "getInt32", "0"),
    "DWORD": ("UInt32", "putUInt32", "getUInt32", "0"),
    "UINT": ("UInt32", "putUInt32", "getUInt32", "0"),
    "UINT32": ("UInt32", "putUInt32", "getUInt32", "0"),
    "u_int": ("UInt32", "putUInt32", "getUInt32", "0"),
    "unsigned int": ("UInt32", "putUInt32", "getUInt32", "0"),
    "unsigned long": ("UInt32", "putUInt32", "getUInt32", "0"),
    "uint32": ("UInt32", "putUInt32", "getUInt32", "0"),
    "__int64": ("Int64", "putInt64", "getInt64", "0n"),
    "INT64": ("Int64", "putInt64", "getInt64", "0n"),
    "__time64_t": ("Int64", "putInt64", "getInt64", "0n"),
    "UidType": ("UidType", "putInt64", "getInt64", "0n"),
    "UINT64": ("UInt64", "putUInt64", "getUInt64", "0n"),
    "unsigned __int64": ("UInt64", "putUInt64", "getUInt64", "0n"),
    "float": ("Float32", "putFloat32", "getFloat32", "0"),
    "double": ("Float64", "putFloat64", "getFloat64", "0"),
    "bool": ("boolean", "putBool", "getBool", "false"),
    "std::string": ("string", "putString", "getString", "''"),
    "string_t": ("string", "putString", "getString", "''"),
    "std::wstring": ("string", "putWString", "getWString", "''"),
    "CTime": ("CTimeValue", "", "", "0"),
}


def split_top_level_template_args(inner: str) -> list[str]:
    parts: list[str] = []
    cur: list[str] = []
    depth = 0
    for ch in inner:
        if ch == "<":
            depth += 1
        elif ch == ">":
            depth -= 1
        elif ch == "," and depth == 0:
            parts.append("".join(cur).strip())
            cur = []
            continue
        cur.append(ch)
    if cur:
        parts.append("".join(cur).strip())
    return parts


def parse_cpp_type_ast(cpp_t: str, local_typedefs: dict[str, str] | None = None) -> tuple[Any, ...]:
    t = re.sub(r"\s+", " ", cpp_t).strip()
    if local_typedefs and t in local_typedefs:
        t = local_typedefs[t]
    if t in SCALAR_MAP:
        return ("scalar", t)
    for tmpl, kind in [
        ("std::vector", "vector"),
        ("std::list", "list"),
        ("std::deque", "deque"),
        ("std::set", "set"),
        ("std::multiset", "multiset"),
        ("std::map", "map"),
        ("std::multimap", "multimap"),
        ("std::pair", "pair"),
    ]:
        prefix = tmpl + "<"
        prefix_sp = tmpl + " <"
        if t.startswith(prefix) or t.startswith(prefix_sp):
            lpos = t.find("<")
            rpos = t.rfind(">")
            inner = t[lpos + 1 : rpos].strip()
            args = split_top_level_template_args(inner)
            parsed_args = [parse_cpp_type_ast(a, local_typedefs) for a in args]
            return (kind, *parsed_args)
    return ("named", t)


def collect_ast_named_refs(ast: tuple[Any, ...], out: set[str]) -> None:
    k = ast[0]
    if k == "named":
        out.add(ast[1])
    elif k in ("vector", "list", "deque", "set", "multiset"):
        collect_ast_named_refs(ast[1], out)
    elif k in ("map", "multimap", "pair"):
        collect_ast_named_refs(ast[1], out)
        collect_ast_named_refs(ast[2], out)


def resolve_array_len(arr_sz: str, variant: StructVariant) -> int:
    if arr_sz.isdigit():
        return int(arr_sz)
    if arr_sz == "SERVER_SN":
        return 12
    if arr_sz == "EQUIPPED_SKILL_SLOT_COUNT":
        return 4
    if arr_sz in variant.static_consts:
        return variant.static_consts[arr_sz]
    for en in variant.enums:
        val = 0
        for it in en.items:
            if it.expr is not None:
                val = eval_enum_expr(it.expr, {})
            if it.name == arr_sz:
                return val
            val += 1
    raise ValueError(f"Unknown array size {arr_sz!r}")


def eval_enum_expr(expr: str, env: dict[str, int]) -> int:
    e = expr.strip()
    # Replace identifiers from env if any
    if e in env:
        return env[e]
    # Safe integer/bitshift/hex expression evaluation
    if not re.match(r"^[0-9xXa-fA-F+\-*/<>|&() \t]+$", e):
        for k, v in env.items():
            e = re.sub(rf"\b{re.escape(k)}\b", str(v), e)
    return int(eval(e, {"__builtins__": {}}, {}))


def resolve_default_expr(
    raw_expr: str | None,
    ast: tuple[Any, ...],
    variant: StructVariant,
    enum_values: dict[str, int],
) -> str | None:
    if raw_expr is None:
        return None
    e = raw_expr.strip()
    if ast[0] == "scalar":
        sc = ast[1]
        if sc in ("__int64", "INT64", "__time64_t", "UidType", "UINT64", "unsigned __int64"):
            if re.match(r"^-?[0-9]+$", e):
                return f"{e}n"
            if re.match(r"^0x[0-9a-fA-F]+$", e):
                return f"{e}n"
            return "0n"
        if sc == "bool":
            if e in ("true", "false"):
                return e
            if e == "1":
                return "true"
            if e == "0":
                return "false"
            return None
        if sc in ("std::string", "string_t", "std::wstring"):
            if e in ('L""', '""', "std::string()", "std::wstring()"):
                return "''"
            m_str = re.match(r'^L?"([^"]*)"$', e)
            if m_str:
                return repr(m_str.group(1))
            return "''"
        if sc in ("float", "double"):
            e2 = re.sub(r"[fF]$", "", e)
            if e2.startswith("."):
                e2 = "0" + e2
            if re.match(r"^-?[0-9]+(?:\.[0-9]+)?$", e2):
                return str(float(e2)) if "." in e2 else e2
            return None
        # integer scalar
        if e in enum_values:
            return str(enum_values[e])
        if "::" in e:
            short = e.split("::")[-1]
            if short in enum_values:
                return str(enum_values[short])
        if re.match(r"^-?(?:0x[0-9a-fA-F]+|[0-9]+)$", e):
            return e
        if e == "false":
            return "0"
    return None


def main() -> None:
    # 1. Evaluate all presets from ServerDefine*.h
    preset_flags: dict[str, dict[str, bool]] = {}
    for pname, init_defs, skip_gc in PRESET_CONFIGS:
        preset_flags[pname] = eval_server_define(init_defs, skip_global_common=skip_gc)

    # 2. Parse EventID files
    sys_items = parse_event_file(EVENT_ID_SYSTEM_H)
    sys_global_items = parse_event_file(EVENT_ID_SYSTEM_GLOBAL_H)
    cli_items = parse_event_file(EVENT_ID_CLIENT_H)
    cli_global_items = parse_event_file(EVENT_ID_CLIENT_GLOBAL_H)

    assert len(sys_global_items) == 0, "Expected EventID_System_Global.h to have 0 active entries"

    system_events: list[EventIdEntry] = []
    cur_val = 0
    for nm, val_expr, hint, comment in sys_items:
        if val_expr:
            cur_val = int(val_expr)
        system_events.append(EventIdEntry(nm, cur_val, "EventID_System.h", comment, val_expr or None, hint))
        cur_val += 1

    sys_end_val = next(e.value for e in system_events if e.name == "E_SYSTEM_EVENT_ID_END")

    # Client events begin at E_CLIENT_EVENT_ID_BEGIN = E_SYSTEM_EVENT_ID_END,
    # then EventID_Client.h before #include, then EventID_Client_Global.h, then EGS_CLIENT_EVENT_ID_END
    client_events: list[EventIdEntry] = []
    client_global_events: list[EventIdEntry] = []
    cur_val = sys_end_val + 1

    # Split cli_items into pre-include and EGS_CLIENT_EVENT_ID_END
    pre_global = cli_items[:-1]
    end_marker = cli_items[-1]
    assert end_marker[0] == "EGS_CLIENT_EVENT_ID_END"

    for nm, val_expr, hint, comment in pre_global:
        if val_expr:
            cur_val = int(val_expr)
        client_events.append(EventIdEntry(nm, cur_val, "EventID_Client.h", comment, val_expr or None, hint))
        cur_val += 1

    for nm, val_expr, hint, comment in cli_global_items:
        if val_expr:
            cur_val = int(val_expr)
        entry = EventIdEntry(nm, cur_val, "OnlyGlobal/EventID_Client_Global.h", comment, val_expr or None, hint)
        client_events.append(entry)
        client_global_events.append(entry)
        cur_val += 1

    client_events.append(
        EventIdEntry(end_marker[0], cur_val, "EventID_Client.h", end_marker[3], None, None)
    )

    # 3. Parse all 4 packet header + cpp pairs
    referenced_macros: set[str] = {
        "SERV_GLOBAL_COMMON",
        "EXTEND_SERVER_GROUP_MASK",
        "SERV_COUNTRY_TW",
        "SERV_COUNTRY_HK",
        "SERV_COUNTRY_TWHK",
        "SERV_COUNTRY_JP",
        "SERV_COUNTRY_EU",
        "SERV_COUNTRY_US",
        "SERV_COUNTRY_CN",
        "SERV_COUNTRY_TH",
        "SERV_COUNTRY_ID",
        "SERV_COUNTRY_BR",
        "SERV_COUNTRY_PH",
        "SERV_COUNTRY_IN",
    }

    parsed_headers: dict[str, tuple[list[StructDecl], list[TopTypedef], list[str]]] = {}
    parsed_cpps: dict[str, dict[str, dict[str, list[tuple[Cond, list[tuple[Cond, str]]]]]]] = {}
    for mod, h_path, cpp_path in PACKET_SPECS:
        parsed_headers[mod] = parse_header_file(mod, h_path, referenced_macros)
        parsed_cpps[mod] = parse_cpp_file(cpp_path, referenced_macros)

    # Also include any macro present in ServerDefine presets that varies across regions
    all_flag_names: set[str] = set(referenced_macros)
    for pf in preset_flags.values():
        for k in pf:
            if k.startswith(("SERV_", "CLIENT_", "GUILD_", "AP_", "CUMULATIVE_", "DROPEVENT_", "ADD_", "EFFECT_")):
                all_flag_names.add(k)
    sorted_flags = sorted(all_flag_names)

    # Emit src/flags/server-flags.ts, presets.ts, index.ts
    write_flags_files(sorted_flags, preset_flags)

    # Emit src/events/*
    write_event_files(system_events, client_events, client_global_events, sys_end_val)

    # 4. Merge cross-file symbols & organize modules cleanly
    all_structs: dict[str, StructDecl] = {}
    all_typedefs: dict[str, TopTypedef] = {}
    module_items: dict[str, list[tuple[str, str]]] = {m: [] for m, _, _ in PACKET_SPECS}

    # Build global map of symbols and attach cpp ops
    for mod, _, _ in PACKET_SPECS:
        structs, typedefs, order = parsed_headers[mod]
        cpp_map = parsed_cpps[mod]
        for sd in structs:
            if sd.name in cpp_map:
                sd.put_ops.extend(cpp_map[sd.name]["PUT"])
                sd.get_ops.extend(cpp_map[sd.name]["GET"])

            # Handle cross-file collisions
            if sd.name == "KRewardData" and mod == "common-packet-global":
                # Identical to CommonPacket.h KRewardData; extend condition to OR
                existing = all_structs["KRewardData"]
                existing.variants[0].cond = cond_or(existing.variants[0].cond, sd.variants[0].cond)
                module_items[mod].append(("reexport-common", "KRewardData"))
                continue
            if sd.name == "EVENT_DATA" and mod == "common-packet-global":
                existing = all_structs["EVENT_DATA"]
                existing.variants.extend(sd.variants)
                existing.put_ops.extend(sd.put_ops)
                existing.get_ops.extend(sd.get_ops)
                module_items[mod].append(("reexport-common", "EVENT_DATA"))
                continue
            if sd.name == "KEGS_GET_ITEM_FROM_LETTER_ACK" and mod == "client-packet":
                existing = all_structs["KEGS_GET_ITEM_FROM_LETTER_ACK"]
                existing.variants.extend(sd.variants)
                existing.put_ops.extend(sd.put_ops)
                existing.get_ops.extend(sd.get_ops)
                module_items[mod].append(("reexport-common", "KEGS_GET_ITEM_FROM_LETTER_ACK"))
                continue

            all_structs[sd.name] = sd
            module_items[mod].append(("struct", sd.name))

        for td in typedefs:
            if td.name in all_structs:
                # Merge typedef into existing StructDecl (e.g. #ifdef/#else struct vs typedef KPacketOK / std::wstring)
                sd = all_structs[td.name]
                for vc, src_t in td.variants:
                    if src_t in ("KPacketOK", "KPacketReason"):
                        ref_sd = all_structs[src_t]
                        v_clone = StructVariant(
                            cond=vc,
                            fields=[FieldDecl(f.name, f.cpp_type, f.array_size, cond_and(vc, f.cond), f.default_expr) for f in ref_sd.variants[0].fields],
                            defaults=dict(ref_sd.variants[0].defaults),
                        )
                        sd.variants.append(v_clone)
                        for p_outer, p_ops in ref_sd.put_ops:
                            sd.put_ops.append((cond_and(vc, p_outer), list(p_ops)))
                        for g_outer, g_ops in ref_sd.get_ops:
                            sd.get_ops.append((cond_and(vc, g_outer), list(g_ops)))
                    else:
                        # Mixed struct + non-struct typedef (e.g. KEGS_GET_SHARE_BANK_REQ: struct vs std::wstring)
                        sd.mixed_typedef_variants.append((vc, src_t))
                continue
            if td.name in all_typedefs:
                all_typedefs[td.name].variants.extend(td.variants)
            else:
                all_typedefs[td.name] = td
                module_items[mod].append(("typedef", td.name))

    # Fix KEGS_GET_ITEM_FROM_LETTER_ACK PUT/GET outer conditions if needed:
    # In CommonPacket.cpp it was inside #ifdef SERV_TRADE_LOGIC_CHANGE_LETTER;
    # in ClientPacket.cpp it was inside #ifdef SERV_TRADE_LOGIC_CHANGE_LETTER #else!
    # Our parser already captured outer_c on each put_ops/get_ops block!

    # Add stub structs for KGuildFindAdInfo and KGuildInviteMsgInfo (missing in upstream C++)
    for stub_name in ("KGuildFindAdInfo", "KGuildInviteMsgInfo"):
        if stub_name not in all_structs:
            stub_sd = StructDecl(
                name=stub_name,
                is_packet=False,
                source_module="common-packet-global",
                variants=[StructVariant(cond=("sym", "SERV_GUILD_FIND_AD"))],
            )
            all_structs[stub_name] = stub_sd
            module_items["common-packet-global"].insert(0, ("struct", stub_name))

    # Inject synthetic optional fields for the 3 C++ header-vs-cpp mismatches so TS compiles cleanly
    def add_synth_field(struct_name: str, field_name: str, cpp_type: str, cond: Cond) -> None:
        sd = all_structs[struct_name]
        for v in sd.variants:
            if not any(f.name == field_name for f in v.fields):
                v.fields.append(FieldDecl(field_name, cpp_type, None, cond, synth_from_cpp=True))

    add_synth_field("KNexonAccountInfo", "m_uRegisteredPC", "UINT8", cond_and(("sym", "SERV_OTP_AUTH"), cond_not(("sym", "SERV_TOONILAND_CHANNELING"))))
    add_synth_field("KEGS_LEAVE_ROOM_REQ", "m_fLogFPS", "float", ("sym", "SERV_DUNGEON_FPS_LOG"))
    add_synth_field("KEGS_MY_USER_UNIT_INFO_TO_SERVER_REQ", "m_fLogFPS", "float", ("sym", "SERV_DUNGEON_FPS_LOG"))

    # Resolve ultimate user-class-ness of every struct & typedef (for ComputeTag eTAG_USERCLASS accuracy)
    def resolve_is_user_class(name: str, seen: set[str] | None = None) -> bool:
        if seen is None:
            seen = set()
        if name in seen:
            return False
        seen.add(name)
        if name in all_structs:
            return True
        if name in all_typedefs:
            # check first variant
            ast = parse_cpp_type_ast(all_typedefs[name].variants[0][1])
            if ast[0] == "named":
                return resolve_is_user_class(ast[1], seen)
            return False
        return False

    is_user_class_map: dict[str, bool] = {}
    for nm in list(all_structs.keys()) + list(all_typedefs.keys()):
        is_user_class_map[nm] = resolve_is_user_class(nm)

    # Track which module defines each symbol
    symbol_owner: dict[str, str] = {}
    for mod, items in module_items.items():
        for kind, nm in items:
            if kind in ("struct", "typedef"):
                symbol_owner[nm] = mod

    # Emit packet modules
    write_packet_modules(
        module_items,
        all_structs,
        all_typedefs,
        is_user_class_map,
        symbol_owner,
    )

    # Emit packet registry + index
    write_registry_and_indices(
        system_events,
        client_events,
        all_structs,
        all_typedefs,
        is_user_class_map,
        symbol_owner,
    )

    print(
        f"Generated protocol-ts successfully: "
        f"{len(sorted_flags)} flags, {len(preset_flags)} presets, "
        f"{len(system_events)} system events, {len(client_events)} client events ({len(client_global_events)} global), "
        f"{len(all_structs)} structs, {len(all_typedefs)} typedefs."
    )


def write_flags_files(sorted_flags: list[str], preset_flags: dict[str, dict[str, bool]]) -> None:
    flags_dir = OUT_ROOT / "flags"
    flags_dir.mkdir(parents=True, exist_ok=True)

    # server-flags.ts
    lines: list[str] = [
        "// Auto-generated by scripts/generate.py — DO NOT EDIT MANUALLY.",
        "",
        "export type ServerRegionPreset =",
        "  | 'DEFAULT'",
        "  | 'KR'",
        "  | 'TW'",
        "  | 'HK'",
        "  | 'TWHK'",
        "  | 'JP'",
        "  | 'EU'",
        "  | 'US'",
        "  | 'CN'",
        "  | 'TH'",
        "  | 'ID'",
        "  | 'BR'",
        "  | 'PH'",
        "  | 'IN';",
        "",
        "export type ServerFlagName =",
    ]
    for fl in sorted_flags:
        lines.append(f"  | '{fl}'")
    lines.append(";")
    lines.append("")
    lines.append("export type ServerFlags = {")
    for fl in sorted_flags:
        lines.append(f"  readonly {fl}: boolean;")
    lines.append("};")
    lines.append("")
    lines.append("export type FlagOverrides = Partial<Record<ServerFlagName, boolean>>;")
    lines.append("")
    lines.append("export type FlagInput =")
    lines.append("  | ServerRegionPreset")
    lines.append("  | ServerFlags")
    lines.append("  | { readonly preset?: ServerRegionPreset; readonly overrides?: FlagOverrides };")
    lines.append("")
    (flags_dir / "server-flags.ts").write_text("\n".join(lines), encoding="utf-8")

    # presets.ts
    plines: list[str] = [
        "// Auto-generated by scripts/generate.py from KncWX2Server/Common/ServerDefine*.h",
        "import type {",
        "  FlagInput,",
        "  FlagOverrides,",
        "  ServerFlagName,",
        "  ServerFlags,",
        "  ServerRegionPreset,",
        "} from './server-flags.ts';",
        "",
        "const BASE_DEFAULT_FLAGS: ServerFlags = {",
    ]
    base = preset_flags["DEFAULT"]
    for fl in sorted_flags:
        v = "true" if base.get(fl, False) else "false"
        plines.append(f"  {fl}: {v},")
    plines.append("};")
    plines.append("")

    preset_vars: list[str] = []
    for pname, _, _ in PRESET_CONFIGS:
        if pname == "DEFAULT":
            plines.append("export const PRESET_DEFAULT: ServerFlags = BASE_DEFAULT_FLAGS;")
            preset_vars.append("DEFAULT: PRESET_DEFAULT")
            continue
        cur = preset_flags[pname]
        diffs = [(fl, cur.get(fl, False)) for fl in sorted_flags if cur.get(fl, False) != base.get(fl, False)]
        plines.append(f"export const PRESET_{pname}: ServerFlags = {{")
        plines.append("  ...BASE_DEFAULT_FLAGS,")
        for fl, val in diffs:
            plines.append(f"  {fl}: {'true' if val else 'false'},")
        plines.append("};")
        preset_vars.append(f"{pname}: PRESET_{pname}")

    plines.extend(
        [
            "",
            "export const SERVER_REGION_PRESETS: Record<ServerRegionPreset, ServerFlags> = {",
            *[f"  {pv}," for pv in preset_vars],
            "};",
            "",
            "export const DEFAULT_SERVER_FLAGS: ServerFlags = PRESET_DEFAULT;",
            "",
            "export function createFlags(",
            "  preset: ServerRegionPreset = 'DEFAULT',",
            "  overrides?: FlagOverrides,",
            "): ServerFlags {",
            "  const base = SERVER_REGION_PRESETS[preset];",
            "  if (!overrides) return base;",
            "  return { ...base, ...overrides };",
            "}",
            "",
            "export function resolveFlags(input?: FlagInput): ServerFlags {",
            "  if (input === undefined) return DEFAULT_SERVER_FLAGS;",
            "  if (typeof input === 'string') return SERVER_REGION_PRESETS[input];",
            "  if ('SERV_GLOBAL_COMMON' in input) return input;",
            "  return createFlags(input.preset ?? 'DEFAULT', input.overrides);",
            "}",
            "",
            "export function isFlagEnabled(flags: FlagInput | undefined, name: ServerFlagName): boolean {",
            "  return resolveFlags(flags)[name];",
            "}",
            "",
            "export function getUidMaskOptions(flags?: FlagInput): { readonly extendServerGroupMask: boolean } {",
            "  const f = resolveFlags(flags);",
            "  return { extendServerGroupMask: f.SERV_COUNTRY_CN || f.SERV_COUNTRY_US || f.EXTEND_SERVER_GROUP_MASK };",
            "}",
            "",
        ]
    )
    (flags_dir / "presets.ts").write_text("\n".join(plines), encoding="utf-8")

    (flags_dir / "index.ts").write_text(
        "export * from './server-flags.ts';\nexport * from './presets.ts';\n",
        encoding="utf-8",
    )


def sanitize_doc(text: str) -> str:
    return text.replace("*/", "* /").strip()


def write_event_files(
    system_events: list[EventIdEntry],
    client_events: list[EventIdEntry],
    client_global_events: list[EventIdEntry],
    sys_end_val: int,
) -> None:
    events_dir = OUT_ROOT / "events"
    events_dir.mkdir(parents=True, exist_ok=True)

    # event-id-system.ts
    slines = [
        "// Auto-generated from KncWX2Server/Common/EventID_System.h & OnlyGlobal/EventID_System_Global.h",
        "",
        "export const EventIDSystem = {",
    ]
    for e in system_events:
        if e.comment:
            slines.append(f"  /** {sanitize_doc(e.comment)} */")
        slines.append(f"  {e.name}: {e.value},")
    slines.extend(
        [
            "} as const;",
            "",
            "export type EventIDSystemName = keyof typeof EventIDSystem;",
            "export type EventIDSystem = (typeof EventIDSystem)[EventIDSystemName];",
            "",
            f"export const E_SYSTEM_EVENT_ID_END = {sys_end_val} as const;",
            "",
        ]
    )
    (events_dir / "event-id-system.ts").write_text("\n".join(slines), encoding="utf-8")

    # event-id-client-global.ts
    glines = [
        "// Auto-generated from KncWX2Server/Common/OnlyGlobal/EventID_Client_Global.h",
        "",
        "export const EventIDClientGlobal = {",
    ]
    for e in client_global_events:
        meta = []
        if e.flag_hint:
            meta.append(f"ifdef {e.flag_hint}")
        if e.comment:
            meta.append(sanitize_doc(e.comment))
        if meta:
            glines.append(f"  /** {' | '.join(meta)} */")
        glines.append(f"  {e.name}: {e.value},")
    glines.extend(
        [
            "} as const;",
            "",
            "export type EventIDClientGlobalName = keyof typeof EventIDClientGlobal;",
            "export type EventIDClientGlobal = (typeof EventIDClientGlobal)[EventIDClientGlobalName];",
            "",
        ]
    )
    (events_dir / "event-id-client-global.ts").write_text("\n".join(glines), encoding="utf-8")

    # event-id-client.ts
    clines = [
        "// Auto-generated from KncWX2Server/Common/EventID_Client.h & OnlyGlobal/EventID_Client_Global.h",
        "// Aligns with KncWX2Server/Common/Event.h (`E_CLIENT_EVENT_ID_BEGIN = E_SYSTEM_EVENT_ID_END`)",
        "// and X2Lib/X2ServerEvent.h (`EVENT_X2_STARTUP = E_SYSTEM_EVENT_ID_END`).",
        "import { E_SYSTEM_EVENT_ID_END } from './event-id-system.ts';",
        "",
        "export const E_CLIENT_EVENT_ID_BEGIN = E_SYSTEM_EVENT_ID_END;",
        "export const EVENT_X2_STARTUP = E_SYSTEM_EVENT_ID_END;",
        "",
        "export const EventIDClient = {",
    ]
    for e in client_events:
        meta = []
        if e.source.endswith("Global.h"):
            meta.append("Global")
        if e.flag_hint:
            meta.append(f"ifdef {e.flag_hint}")
        if e.comment:
            meta.append(sanitize_doc(e.comment))
        if meta:
            clines.append(f"  /** {' | '.join(meta)} */")
        clines.append(f"  {e.name}: {e.value},")
    clines.extend(
        [
            "} as const;",
            "",
            "export type EventIDClientName = keyof typeof EventIDClient;",
            "export type EventIDClient = (typeof EventIDClient)[EventIDClientName];",
            "",
        ]
    )
    (events_dir / "event-id-client.ts").write_text("\n".join(clines), encoding="utf-8")

    # index.ts
    ilines = [
        "// Auto-generated combined EventID registry",
        "import { EventIDSystem } from './event-id-system.ts';",
        "import { EventIDClient, E_CLIENT_EVENT_ID_BEGIN, EVENT_X2_STARTUP } from './event-id-client.ts';",
        "",
        "export * from './event-id-system.ts';",
        "export * from './event-id-client-global.ts';",
        "export * from './event-id-client.ts';",
        "",
        "export const EventID = {",
        "  ...EventIDSystem,",
        "  ...EventIDClient,",
        "  E_CLIENT_EVENT_ID_BEGIN,",
        "  EVENT_X2_STARTUP,",
        "} as const;",
        "",
        "export type EventIDName = keyof typeof EventID;",
        "export type EventID = (typeof EventID)[EventIDName];",
        "",
        "const EVENT_ID_NAMES_BY_VALUE: ReadonlyArray<string> = [",
    ]
    all_ordered = system_events + client_events
    for idx, e in enumerate(all_ordered):
        assert e.value == idx, f"EventID alignment mismatch at {e.name}: expected {idx}, got {e.value}"
        ilines.append(f"  '{e.name}',")
    ilines.extend(
        [
            "];",
            "",
            "export function getEventIdName(id: number): string | undefined {",
            "  return EVENT_ID_NAMES_BY_VALUE[id];",
            "}",
            "",
            "export function getEventIdValue(name: EventIDName): EventID {",
            "  return EventID[name];",
            "}",
            "",
        ]
    )
    (events_dir / "index.ts").write_text("\n".join(ilines), encoding="utf-8")


def write_packet_modules(
    module_items: dict[str, list[tuple[str, str]]],
    all_structs: dict[str, StructDecl],
    all_typedefs: dict[str, TopTypedef],
    is_user_class_map: dict[str, bool],
    symbol_owner: dict[str, str],
) -> None:
    pkt_dir = OUT_ROOT / "packets"
    pkt_dir.mkdir(parents=True, exist_ok=True)

    # Helper to render TS type for any C++ AST
    def ast_to_ts(ast: tuple[Any, ...]) -> str:
        k = ast[0]
        if k == "scalar":
            return SCALAR_MAP[ast[1]][0]
        if k == "named":
            return ast[1]
        if k in ("vector", "list", "deque", "multiset"):
            return f"{ast_to_ts(ast[1])}[]"
        if k == "set":
            return f"Set<{ast_to_ts(ast[1])}>"
        if k == "map":
            return f"Map<{ast_to_ts(ast[1])}, {ast_to_ts(ast[2])}>"
        if k == "multimap":
            return f"Array<[{ast_to_ts(ast[1])}, {ast_to_ts(ast[2])}]>"
        if k == "pair":
            return f"[{ast_to_ts(ast[1])}, {ast_to_ts(ast[2])}]"
        raise ValueError(f"Unknown AST {ast!r}")

    def ast_to_default(ast: tuple[Any, ...], explicit: str | None = None) -> str:
        if explicit is not None:
            return explicit
        k = ast[0]
        if k == "scalar":
            return SCALAR_MAP[ast[1]][3]
        if k == "named":
            return f"create{ast[1]}(f)"
        if k in ("vector", "list", "deque", "multiset"):
            return f"([] as {ast_to_ts(ast[1])}[])"
        if k == "multimap":
            return f"([] as Array<[{ast_to_ts(ast[1])}, {ast_to_ts(ast[2])}]>)"
        if k == "set":
            return f"new Set<{ast_to_ts(ast[1])}>()"
        if k == "map":
            return f"new Map<{ast_to_ts(ast[1])}, {ast_to_ts(ast[2])}>()"
        if k == "pair":
            return f"[{ast_to_default(ast[1])}, {ast_to_default(ast[2])}]"
        raise ValueError(f"Unknown AST {ast!r}")

    def ast_to_put(ast: tuple[Any, ...], val_expr: str) -> str:
        k = ast[0]
        if k == "scalar":
            meth = SCALAR_MAP[ast[1]][1]
            return f"ks.{meth}({val_expr})" if meth else "true"
        if k == "named":
            nm = ast[1]
            if is_user_class_map.get(nm, False):
                return f"ks.putUserClass({val_expr}, put{nm}, f)"
            return f"put{nm}(ks, {val_expr}, f)"
        if k in ("vector", "list", "deque", "multiset"):
            fn_map = {"vector": "putVector", "list": "putList", "deque": "putDeque", "multiset": "putMultiSet"}
            elem_ts = ast_to_ts(ast[1])
            inner = ast_to_put(ast[1], "item")
            return f"ks.{fn_map[k]}({val_expr}, (ks, item: {elem_ts}) => {inner})"
        if k == "set":
            elem_ts = ast_to_ts(ast[1])
            inner = ast_to_put(ast[1], "item")
            return f"ks.putSet({val_expr}, (ks, item: {elem_ts}) => {inner})"
        if k == "map":
            k_ts = ast_to_ts(ast[1])
            v_ts = ast_to_ts(ast[2])
            pk = ast_to_put(ast[1], "k")
            pv = ast_to_put(ast[2], "v")
            return f"ks.putMap({val_expr}, (ks, k: {k_ts}) => {pk}, (ks, v: {v_ts}) => {pv})"
        if k == "multimap":
            k_ts = ast_to_ts(ast[1])
            v_ts = ast_to_ts(ast[2])
            pk = ast_to_put(ast[1], "k")
            pv = ast_to_put(ast[2], "v")
            return f"ks.putMultiMap({val_expr}, (ks, k: {k_ts}) => {pk}, (ks, v: {v_ts}) => {pv})"
        if k == "pair":
            a_ts = ast_to_ts(ast[1])
            b_ts = ast_to_ts(ast[2])
            pa = ast_to_put(ast[1], "a")
            pb = ast_to_put(ast[2], "b")
            return f"ks.putPair({val_expr}, (ks, a: {a_ts}) => {pa}, (ks, b: {b_ts}) => {pb})"
        raise ValueError(f"Unknown AST {ast!r}")

    def ast_to_get(ast: tuple[Any, ...]) -> str:
        k = ast[0]
        if k == "scalar":
            meth = SCALAR_MAP[ast[1]][2]
            return f"ks.{meth}()" if meth else "0"
        if k == "named":
            nm = ast[1]
            if is_user_class_map.get(nm, False):
                return f"ks.getUserClass(get{nm}, f)"
            return f"get{nm}(ks, f)"
        if k in ("vector", "list", "deque", "multiset"):
            fn_map = {"vector": "getVector", "list": "getList", "deque": "getDeque", "multiset": "getMultiSet"}
            elem_ts = ast_to_ts(ast[1])
            inner = ast_to_get(ast[1])
            return f"ks.{fn_map[k]}<{elem_ts}>((ks) => {inner})"
        if k == "set":
            elem_ts = ast_to_ts(ast[1])
            inner = ast_to_get(ast[1])
            return f"ks.getSet<{elem_ts}>((ks) => {inner})"
        if k == "map":
            k_ts = ast_to_ts(ast[1])
            v_ts = ast_to_ts(ast[2])
            gk = ast_to_get(ast[1])
            gv = ast_to_get(ast[2])
            return f"ks.getMap<{k_ts}, {v_ts}>((ks) => {gk}, (ks) => {gv})"
        if k == "multimap":
            k_ts = ast_to_ts(ast[1])
            v_ts = ast_to_ts(ast[2])
            gk = ast_to_get(ast[1])
            gv = ast_to_get(ast[2])
            return f"ks.getMultiMap<{k_ts}, {v_ts}>((ks) => {gk}, (ks) => {gv})"
        if k == "pair":
            a_ts = ast_to_ts(ast[1])
            b_ts = ast_to_ts(ast[2])
            ga = ast_to_get(ast[1])
            gb = ast_to_get(ast[2])
            return f"ks.getPair<{a_ts}, {b_ts}>((ks) => {ga}, (ks) => {gb})"
        raise ValueError(f"Unknown AST {ast!r}")

    # Generate each of the 4 packet files
    for mod, _, _ in PACKET_SPECS:
        items = module_items[mod]

        # Collect cross-module imports needed by structs/typedefs in this module
        refs: set[str] = set()
        reexport_common: list[str] = []
        for kind, nm in items:
            if kind == "reexport-common":
                reexport_common.append(nm)
            elif kind == "struct":
                sd = all_structs[nm]
                for v in sd.variants:
                    for fld in v.fields:
                        collect_ast_named_refs(parse_cpp_type_ast(fld.cpp_type, v.local_typedefs), refs)
            elif kind == "typedef":
                td = all_typedefs[nm]
                for _, src_t in td.variants:
                    collect_ast_named_refs(parse_cpp_type_ast(src_t), refs)

        imports_by_mod: dict[str, set[str]] = {}
        for ref in sorted(refs):
            owner = symbol_owner.get(ref)
            if owner and owner != mod:
                imports_by_mod.setdefault(owner, set()).add(ref)

        out: list[str] = [
            f"// Auto-generated from {mod} (.h/.cpp) by scripts/generate.py — DO NOT EDIT MANUALLY.",
            "/* eslint-disable @typescript-eslint/no-unused-vars */",
            "import { KSerializer } from '../runtime/serializer.ts';",
            "import type {",
            "  CTimeValue,",
            "  Float32,",
            "  Float64,",
            "  Int8,",
            "  Int16,",
            "  Int32,",
            "  Int64,",
            "  UInt8,",
            "  UInt16,",
            "  UInt32,",
            "  UInt64,",
            "  UidType,",
            "} from '../runtime/types.ts';",
            "import { resolveFlags } from '../flags/presets.ts';",
            "import type { FlagInput, ServerFlags } from '../flags/server-flags.ts';",
        ]
        for dep_mod, dep_syms in sorted(imports_by_mod.items()):
            for sym in sorted(dep_syms):
                out.append(f"import {{ type {sym}, create{sym}, put{sym}, get{sym} }} from './{dep_mod}.ts';")

        for rc in reexport_common:
            if "common-packet" not in imports_by_mod or rc not in imports_by_mod["common-packet"]:
                out.append(f"export {{ type {rc}, create{rc}, put{rc}, get{rc} }} from './common-packet.ts';")
            else:
                out.append(f"export {{ type {rc}, create{rc}, put{rc}, get{rc} }};")

        out.append("")

        for kind, nm in items:
            if kind == "reexport-common":
                continue
            if kind == "typedef":
                td = all_typedefs[nm]
                # Deduplicate identical TS target types
                ts_types: list[str] = []
                variants_ast: list[tuple[Cond, tuple[Any, ...]]] = []
                for c, src_t in td.variants:
                    ast = parse_cpp_type_ast(src_t)
                    variants_ast.append((c, ast))
                    tt = ast_to_ts(ast)
                    if tt not in ts_types:
                        ts_types.append(tt)
                union_ts = " | ".join(ts_types)
                out.append(f"export type {nm} = {union_ts};")
                # create/put/get
                if len(variants_ast) == 1:
                    _, ast = variants_ast[0]
                    d_expr = ast_to_default(ast)
                    p_expr = ast_to_put(ast, "obj")
                    g_expr = ast_to_get(ast)
                    out.append(f"export function create{nm}(flags?: FlagInput): {nm} {{")
                    if "create" in d_expr:
                        out.append("  const f = resolveFlags(flags);")
                    out.append(f"  return {d_expr};")
                    out.append("}")
                    out.append(f"export function put{nm}(ks: KSerializer, obj: {nm}, flags?: FlagInput): boolean {{")
                    if "(f)" in p_expr or ", f)" in p_expr:
                        out.append("  const f = resolveFlags(flags);")
                    out.append(f"  return {p_expr};")
                    out.append("}")
                    out.append(f"export function get{nm}(ks: KSerializer, flags?: FlagInput): {nm} {{")
                    if "(f)" in g_expr or ", f)" in g_expr:
                        out.append("  const f = resolveFlags(flags);")
                    out.append(f"  return {g_expr};")
                    out.append("}")
                else:
                    # Multiple variants (e.g. KItemPositionUpdate, KEGS_LEAVE_WEDDING_HALL_REQ)
                    out.append(f"export function create{nm}(flags?: FlagInput): {nm} {{")
                    out.append("  const f = resolveFlags(flags);")
                    for idx_v, (vc, ast) in enumerate(variants_ast):
                        kw = "if" if idx_v == 0 else "else if"
                        if idx_v == len(variants_ast) - 1 and len(variants_ast) == 2 and vc == cond_not(variants_ast[0][0]):
                            out.append(f"  return {ast_to_default(ast)};")
                        else:
                            out.append(f"  {kw} ({cond_to_ts(vc)}) return {ast_to_default(ast)};")
                    if len(variants_ast) != 2 or variants_ast[1][0] != cond_not(variants_ast[0][0]):
                        out.append(f"  return {ast_to_default(variants_ast[0][1])};")
                    out.append("}")
                    out.append(f"export function put{nm}(ks: KSerializer, obj: {nm}, flags?: FlagInput): boolean {{")
                    out.append("  const f = resolveFlags(flags);")
                    for idx_v, (vc, ast) in enumerate(variants_ast):
                        tt = ast_to_ts(ast)
                        cast_obj = f"(obj as {tt})" if len(ts_types) > 1 else "obj"
                        if idx_v == len(variants_ast) - 1 and len(variants_ast) == 2 and vc == cond_not(variants_ast[0][0]):
                            out.append(f"  return {ast_to_put(ast, cast_obj)};")
                        else:
                            kw = "if" if idx_v == 0 else "else if"
                            out.append(f"  {kw} ({cond_to_ts(vc)}) return {ast_to_put(ast, cast_obj)};")
                    if len(variants_ast) != 2 or variants_ast[1][0] != cond_not(variants_ast[0][0]):
                        tt0 = ast_to_ts(variants_ast[0][1])
                        c0 = f"(obj as {tt0})" if len(ts_types) > 1 else "obj"
                        out.append(f"  return {ast_to_put(variants_ast[0][1], c0)};")
                    out.append("}")
                    out.append(f"export function get{nm}(ks: KSerializer, flags?: FlagInput): {nm} {{")
                    out.append("  const f = resolveFlags(flags);")
                    for idx_v, (vc, ast) in enumerate(variants_ast):
                        if idx_v == len(variants_ast) - 1 and len(variants_ast) == 2 and vc == cond_not(variants_ast[0][0]):
                            out.append(f"  return {ast_to_get(ast)};")
                        else:
                            kw = "if" if idx_v == 0 else "else if"
                            out.append(f"  {kw} ({cond_to_ts(vc)}) return {ast_to_get(ast)};")
                    if len(variants_ast) != 2 or variants_ast[1][0] != cond_not(variants_ast[0][0]):
                        out.append(f"  return {ast_to_get(variants_ast[0][1])};")
                    out.append("}")
                out.append("")
                continue

            # Struct
            sd = all_structs[nm]
            emit_struct(out, sd, ast_to_ts, ast_to_default, ast_to_put, ast_to_get)

        (pkt_dir / f"{mod}.ts").write_text("\n".join(out), encoding="utf-8")


def emit_struct(
    out: list[str],
    sd: StructDecl,
    ast_to_ts: Any,
    ast_to_default: Any,
    ast_to_put: Any,
    ast_to_get: Any,
) -> None:
    nm = sd.name
    # Handle hybrid struct + non-struct typedef (e.g. KEGS_GET_SHARE_BANK_REQ: struct vs std::wstring)
    if sd.mixed_typedef_variants:
        struct_nm = f"{nm}_Struct"
        clone_sd = StructDecl(
            name=struct_nm,
            is_packet=sd.is_packet,
            source_module=sd.source_module,
            variants=sd.variants,
            put_ops=sd.put_ops,
            get_ops=sd.get_ops,
        )
        emit_struct(out, clone_sd, ast_to_ts, ast_to_default, ast_to_put, ast_to_get)
        extra_asts = [(vc, parse_cpp_type_ast(src_t)) for vc, src_t in sd.mixed_typedef_variants]
        extra_ts = [ast_to_ts(ast) for _, ast in extra_asts]
        out.append(f"export type {nm} = {struct_nm} | {' | '.join(extra_ts)};")
        # create
        out.append(f"export function create{nm}(flags?: FlagInput): {nm} {{")
        out.append("  const f = resolveFlags(flags);")
        for vc, ast in extra_asts:
            out.append(f"  if ({cond_to_ts(vc)}) return {ast_to_default(ast)};")
        out.append(f"  return create{struct_nm}(f);")
        out.append("}")
        # put
        out.append(f"export function put{nm}(ks: KSerializer, obj: {nm}, flags?: FlagInput): boolean {{")
        out.append("  const f = resolveFlags(flags);")
        for vc, ast in extra_asts:
            tt = ast_to_ts(ast)
            out.append(f"  if ({cond_to_ts(vc)}) return {ast_to_put(ast, f'(obj as {tt})')};")
        out.append(f"  return put{struct_nm}(ks, obj as {struct_nm}, f);")
        out.append("}")
        # get
        out.append(f"export function get{nm}(ks: KSerializer, flags?: FlagInput): {nm} {{")
        out.append("  const f = resolveFlags(flags);")
        for vc, ast in extra_asts:
            out.append(f"  if ({cond_to_ts(vc)}) return {ast_to_get(ast)};")
        out.append(f"  return get{struct_nm}(ks, f);")
        out.append("}")
        out.append("")
        return

    # Collect enums across variants (deduplicated by name)
    seen_enums: set[str] = set()
    enum_val_lookup: dict[str, int] = {}
    for v in sd.variants:
        for en in v.enums:
            has_cond = any(it.cond != TRUE_COND for it in en.items)
            # Compute static values (using all items if no cond, or DEFAULT-style with all items if trailing; wait: let's evaluate using DEFAULT preset!)
            env: dict[str, int] = {}
            cur_v = 0
            static_items: list[tuple[str, int]] = []
            # Wait: check if this enum differs under DEFAULT vs all-on; for static const use DEFAULT or first-seen if all conds false
            for it in en.items:
                if it.expr is not None:
                    cur_v = eval_enum_expr(it.expr, env)
                env[it.name] = cur_v
                enum_val_lookup[it.name] = cur_v
                static_items.append((it.name, cur_v))
                cur_v += 1
            if en.name not in seen_enums:
                seen_enums.add(en.name)
                const_name = f"{nm}_{en.name}"
                out.append(f"export const {const_name} = {{")
                for item_nm, item_val in static_items:
                    out.append(f"  {item_nm}: {item_val},")
                out.append("} as const;")
                out.append(f"export type {const_name} = (typeof {const_name})[keyof typeof {const_name}];")
                if has_cond:
                    # Also emit flag-aware enum evaluator
                    out.append(f"export function get{const_name}(flags?: FlagInput): Record<string, number> {{")
                    out.append("  const f = resolveFlags(flags);")
                    out.append("  const out: Record<string, number> = {};")
                    out.append("  let cur = 0;")
                    for it in en.items:
                        if it.cond != TRUE_COND:
                            out.append(f"  if ({cond_to_ts(it.cond)}) {{")
                            indent = "    "
                        else:
                            indent = "  "
                        if it.expr is not None:
                            out.append(f"{indent}cur = {eval_enum_expr(it.expr, env)};")
                        out.append(f"{indent}out['{it.name}'] = cur;")
                        out.append(f"{indent}cur += 1;")
                        if it.cond != TRUE_COND:
                            out.append("  }")
                    out.append("  return out;")
                    out.append("}")

    # Deduplicate variants that are structurally identical (like KRewardItem)
    # Build unified field map across all variants
    # Track per-field: ordered list of (effective_cond, variant_idx, FieldDecl, parsed_ast)
    field_specs: dict[str, list[tuple[Cond, int, FieldDecl, tuple[Any, ...]]]] = {}
    field_order: list[str] = []
    for v_idx, v in enumerate(sd.variants):
        for fld in v.fields:
            ast = parse_cpp_type_ast(fld.cpp_type, v.local_typedefs)
            eff_c = cond_and(v.cond, fld.cond)
            if fld.name not in field_specs:
                field_specs[fld.name] = []
                field_order.append(fld.name)
            field_specs[fld.name].append((eff_c, v_idx, fld, ast))

    # Determine required vs optional per field on merged interface
    # A field is required iff len(sd.variants) == 1 and field appears with cond == TRUE_COND (or exhaustive A || !A)
    def is_field_required(fname: str) -> bool:
        occ = field_specs[fname]
        if len(sd.variants) == 1:
            if any(eff_c == TRUE_COND for eff_c, _, _, _ in occ):
                return True
            # Check simple A and !A complement
            if len(occ) == 2 and occ[0][0] == cond_not(occ[1][0]):
                return True
            return False
        else:
            # Multi-variant struct (e.g. KPartyUserInfo, KEGS_SELECT_UNIT_ACK, KEGS_SOCKET_ITEM_REQ/ACK)
            # Required only if every variant has it unconditionally!
            v_indices_uncond = {vi for _, vi, fld, _ in occ if fld.cond == TRUE_COND}
            return len(v_indices_uncond) == len(sd.variants)

    # Emit interface
    out.append(f"export interface {nm} {{")
    for fname in field_order:
        occ = field_specs[fname]
        ts_opts: list[str] = []
        for _, _, fld, ast in occ:
            tstr = ast_to_ts(ast)
            if fld.array_size is not None:
                tstr = f"{tstr}[]"
            if tstr not in ts_opts:
                ts_opts.append(tstr)
        req = is_field_required(fname)
        q = "" if req else "?"
        out.append(f"  {fname}{q}: {' | '.join(ts_opts)};")
    out.append("}")

    # Emit create<nm>(flags?: FlagInput): <nm>
    out.append(f"export function create{nm}(flags?: FlagInput): {nm} {{")
    out.append("  const f = resolveFlags(flags);")
    if not field_order:
        out.append("  return {};")
        out.append("}")
    elif len(sd.variants) == 1:
        v = sd.variants[0]
        # Check if all fields are required & single-type -> clean literal return; otherwise build object
        has_cond_fields = any(not is_field_required(fn) or len(field_specs[fn]) > 1 for fn in field_order)
        if not has_cond_fields:
            out.append("  return {")
            for fname in field_order:
                _, _, fld, ast = field_specs[fname][0]
                d_val = resolve_field_default(fld, ast, v, enum_val_lookup, ast_to_default)
                out.append(f"    {fname}: {d_val},")
            out.append("  };")
            out.append("}")
        else:
            req_fields = [fn for fn in field_order if is_field_required(fn)]
            opt_fields = [fn for fn in field_order if not is_field_required(fn)]
            out.append(f"  const obj: {nm} = {{")
            for fname in req_fields:
                occ = field_specs[fname]
                if len(occ) == 1:
                    _, _, fld, ast = occ[0]
                    d_val = resolve_field_default(fld, ast, v, enum_val_lookup, ast_to_default)
                    out.append(f"    {fname}: {d_val},")
                else:
                    # Exhaustive branch inside required field -> ternary
                    c0, _, fld0, ast0 = occ[0]
                    _, _, fld1, ast1 = occ[1]
                    d0 = resolve_field_default(fld0, ast0, v, enum_val_lookup, ast_to_default)
                    d1 = resolve_field_default(fld1, ast1, v, enum_val_lookup, ast_to_default)
                    if d0 == d1:
                        out.append(f"    {fname}: {d0},")
                    else:
                        out.append(f"    {fname}: ({cond_to_ts(c0)}) ? {d0} : {d1},")
            out.append("  };")
            for fname in opt_fields:
                occ = field_specs[fname]
                for eff_c, _, fld, ast in occ:
                    if fld.synth_from_cpp:
                        continue
                    d_val = resolve_field_default(fld, ast, v, enum_val_lookup, ast_to_default)
                    out.append(f"  if ({cond_to_ts(eff_c)}) obj.{fname} = {d_val};")
            out.append("  return obj;")
            out.append("}")
    else:
        # Multi-variant struct
        req_fields = [fn for fn in field_order if is_field_required(fn)]
        out.append(f"  const obj: {nm} = {{")
        for fname in req_fields:
            _, _, fld0, ast0 = field_specs[fname][0]
            d_val = resolve_field_default(fld0, ast0, sd.variants[0], enum_val_lookup, ast_to_default)
            out.append(f"    {fname}: {d_val},")
        out.append("  };")
        for v_idx, v in enumerate(sd.variants):
            kw = "if" if v_idx == 0 else "else if"
            out.append(f"  {kw} ({cond_to_ts(v.cond)}) {{")
            for fld in v.fields:
                if fld.name in req_fields or fld.synth_from_cpp:
                    continue
                ast = parse_cpp_type_ast(fld.cpp_type, v.local_typedefs)
                d_val = resolve_field_default(fld, ast, v, enum_val_lookup, ast_to_default)
                if fld.cond == TRUE_COND:
                    out.append(f"    obj.{fld.name} = {d_val};")
                else:
                    out.append(f"    if ({cond_to_ts(fld.cond)}) obj.{fld.name} = {d_val};")
            out.append("  }")
        out.append("  return obj;")
        out.append("}")

    # Pick authoritative op list for PUT and GET (fixing the 3 known C++ asymmetries)
    put_blocks = sd.put_ops
    get_blocks = sd.get_ops
    if nm == "KPartyUserInfo":
        # GET has m_wstrInternalIP/m_usInternalPort cleanly outside SERV_CHOOSE_FASTEST_HOST
        put_blocks = get_blocks
    elif nm == "KEGS_EXPIRE_CASH_SKILL_POINT_NOT":
        # PUT has m_vecMapHaveSKill/m_mapHaveSKill cleanly inside SERV_UPGRADE_SKILL_SYSTEM_2013
        get_blocks = put_blocks

    # Helper to find the active field AST & type for an op expression inside a given outer condition + variant
    def find_field_for_op(op_expr: str, op_cond: Cond, outer_cond: Cond) -> tuple[str, int | None, list[tuple[Cond, FieldDecl, tuple[Any, ...], StructVariant]]]:
        m_arr = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)\s*\[\s*([0-9]+)\s*\]$", op_expr)
        if m_arr:
            fname, arr_idx = m_arr.group(1), int(m_arr.group(2))
        else:
            fname, arr_idx = op_expr, None
        matches: list[tuple[Cond, FieldDecl, tuple[Any, ...], StructVariant]] = []
        full_op_c = cond_and(outer_cond, op_cond)
        for v in sd.variants:
            for fld in v.fields:
                if fld.name == fname:
                    ast = parse_cpp_type_ast(fld.cpp_type, v.local_typedefs)
                    matches.append((cond_and(v.cond, fld.cond), fld, ast, v))
        return fname, arr_idx, matches

    # Emit put<nm>(ks, obj, flags)
    out.append(f"export function put{nm}(ks: KSerializer, obj: {nm}, flags?: FlagInput): boolean {{")
    if not put_blocks:
        out.append("  return true;")
        out.append("}")
    else:
        out.append("  const f = resolveFlags(flags);")
        if len(put_blocks) == 1 and put_blocks[0][0] == TRUE_COND and not put_blocks[0][1]:
            out.append("  return true;")
            out.append("}")
        else:
            emit_put_blocks(out, nm, put_blocks, field_specs, is_field_required, find_field_for_op, ast_to_default, ast_to_put, enum_val_lookup)
            out.append("}")

    # Emit get<nm>(ks, flags)
    out.append(f"export function get{nm}(ks: KSerializer, flags?: FlagInput): {nm} {{")
    if not get_blocks:
        out.append(f"  return create{nm}(flags);")
        out.append("}")
    else:
        out.append("  const f = resolveFlags(flags);")
        emit_get_blocks(out, nm, sd, get_blocks, field_specs, field_order, is_field_required, find_field_for_op, ast_to_default, ast_to_get, enum_val_lookup)
        out.append("}")
    out.append("")


def resolve_field_default(
    fld: FieldDecl,
    ast: tuple[Any, ...],
    variant: StructVariant,
    enum_val_lookup: dict[str, int],
    ast_to_default: Any,
) -> str:
    if fld.array_size is not None:
        arr_n = resolve_array_len(fld.array_size, variant)
        elem_d = ast_to_default(ast)
        return f"Array.from({{ length: {arr_n} }}, () => {elem_d})"
    explicit = resolve_default_expr(fld.default_expr or variant.defaults.get(fld.name), ast, variant, enum_val_lookup)
    return ast_to_default(ast, explicit)


def emit_put_blocks(
    out: list[str],
    nm: str,
    put_blocks: list[tuple[Cond, list[tuple[Cond, str]]]],
    field_specs: dict[str, list[tuple[Cond, int, FieldDecl, tuple[Any, ...]]]],
    is_field_required: Any,
    find_field_for_op: Any,
    ast_to_default: Any,
    ast_to_put: Any,
    enum_val_lookup: dict[str, int],
) -> None:
    def emit_ops(ops: list[tuple[Cond, str]], outer_c: Cond, indent: str) -> None:
        for op_c, op_expr in ops:
            fname, arr_idx, matches = find_field_for_op(op_expr, op_c, outer_c)
            assert matches, f"No matching field for PUT({op_expr}) in {nm}"
            # Narrow to matching branch if multiple field types exist
            if len(matches) == 1:
                _, fld, ast, variant = matches[0]
                req = is_field_required(fname)
                def_expr = ast_to_default(ast) if arr_idx is not None else resolve_field_default(fld, ast, variant, enum_val_lookup, ast_to_default)
                if arr_idx is not None:
                    val_expr = f"(obj.{fname}?.[{arr_idx}] ?? {def_expr})" if not req else f"(obj.{fname}[{arr_idx}] ?? {def_expr})"
                else:
                    val_expr = f"(obj.{fname} ?? {def_expr})" if not req else f"obj.{fname}"
                call = ast_to_put(ast, val_expr)
                if op_c != TRUE_COND:
                    out.append(f"{indent}if ({cond_to_ts(op_c)}) {{ if (!({call})) return false; }}")
                else:
                    out.append(f"{indent}if (!({call})) return false;")
            else:
                # Multiple matching field definitions across variants/branches
                # Pick matching variant by outer_c + op_c
                target_c = cond_and(outer_c, op_c)
                chosen = None
                for mc, fld, ast, variant in matches:
                    if mc == target_c:
                        chosen = (fld, ast, variant)
                        break
                if chosen is None:
                    # Fallback: branch on mc inside op_c
                    if op_c != TRUE_COND:
                        out.append(f"{indent}if ({cond_to_ts(op_c)}) {{")
                        sub_ind = indent + "  "
                    else:
                        sub_ind = indent
                    for m_i, (mc, fld, ast, variant) in enumerate(matches):
                        kw = "if" if m_i == 0 else "else if"
                        req = is_field_required(fname)
                        def_expr = resolve_field_default(fld, ast, variant, enum_val_lookup, ast_to_default)
                        val_expr = f"(obj.{fname} ?? {def_expr})" if not req else f"obj.{fname}"
                        ts_t = ast_to_ts_for_cast(ast)
                        call = ast_to_put(ast, f"({val_expr} as {ts_t})")
                        out.append(f"{sub_ind}{kw} ({cond_to_ts(mc)}) {{ if (!({call})) return false; }}")
                    if op_c != TRUE_COND:
                        out.append(f"{indent}}}")
                else:
                    fld, ast, variant = chosen
                    req = is_field_required(fname)
                    def_expr = ast_to_default(ast) if arr_idx is not None else resolve_field_default(fld, ast, variant, enum_val_lookup, ast_to_default)
                    if arr_idx is not None:
                        val_expr = f"(obj.{fname}?.[{arr_idx}] ?? {def_expr})" if not req else f"(obj.{fname}[{arr_idx}] ?? {def_expr})"
                    else:
                        val_expr = f"(obj.{fname} ?? {def_expr})" if not req else f"obj.{fname}"
                    # Cast when field has union type on interface
                    ts_opts = {ast_to_ts_for_cast(m[2]) for m in matches}
                    if len(ts_opts) > 1:
                        val_expr = f"({val_expr} as {ast_to_ts_for_cast(ast)})"
                    call = ast_to_put(ast, val_expr)
                    if op_c != TRUE_COND:
                        out.append(f"{indent}if ({cond_to_ts(op_c)}) {{ if (!({call})) return false; }}")
                    else:
                        out.append(f"{indent}if (!({call})) return false;")

    if len(put_blocks) == 1:
        outer_c, ops = put_blocks[0]
        if outer_c == TRUE_COND:
            emit_ops(ops, outer_c, "  ")
        else:
            out.append(f"  if ({cond_to_ts(outer_c)}) {{")
            emit_ops(ops, outer_c, "    ")
            out.append("  }")
    else:
        for idx, (outer_c, ops) in enumerate(put_blocks):
            kw = "if" if idx == 0 else "else if"
            out.append(f"  {kw} ({cond_to_ts(outer_c)}) {{")
            emit_ops(ops, outer_c, "    ")
            out.append("  }")
    out.append("  return true;")


def ast_to_ts_for_cast(ast: tuple[Any, ...]) -> str:
    k = ast[0]
    if k == "scalar":
        return SCALAR_MAP[ast[1]][0]
    if k == "named":
        return ast[1]
    if k in ("vector", "list", "deque", "multiset"):
        return f"{ast_to_ts_for_cast(ast[1])}[]"
    if k == "set":
        return f"Set<{ast_to_ts_for_cast(ast[1])}>"
    if k == "map":
        return f"Map<{ast_to_ts_for_cast(ast[1])}, {ast_to_ts_for_cast(ast[2])}>"
    if k == "multimap":
        return f"Array<[{ast_to_ts_for_cast(ast[1])}, {ast_to_ts_for_cast(ast[2])}]>"
    if k == "pair":
        return f"[{ast_to_ts_for_cast(ast[1])}, {ast_to_ts_for_cast(ast[2])}]"
    return "never"


def emit_get_blocks(
    out: list[str],
    nm: str,
    sd: StructDecl,
    get_blocks: list[tuple[Cond, list[tuple[Cond, str]]]],
    field_specs: dict[str, list[tuple[Cond, int, FieldDecl, tuple[Any, ...]]]],
    field_order: list[str],
    is_field_required: Any,
    find_field_for_op: Any,
    ast_to_default: Any,
    ast_to_get: Any,
    enum_val_lookup: dict[str, int],
) -> None:
    out.append(f"  const obj = create{nm}(f);")

    def emit_ops(ops: list[tuple[Cond, str]], outer_c: Cond, indent: str) -> None:
        for op_c, op_expr in ops:
            fname, arr_idx, matches = find_field_for_op(op_expr, op_c, outer_c)
            assert matches, f"No matching field for GET({op_expr}) in {nm}"
            if len(matches) == 1:
                _, fld, ast, _ = matches[0]
                g_expr = ast_to_get(ast)
                if arr_idx is not None:
                    assign = f"(obj.{fname} ??= [])[{arr_idx}] = {g_expr};" if not is_field_required(fname) else f"obj.{fname}[{arr_idx}] = {g_expr};"
                else:
                    assign = f"obj.{fname} = {g_expr};"
                if op_c != TRUE_COND:
                    out.append(f"{indent}if ({cond_to_ts(op_c)}) {{ {assign} }}")
                else:
                    out.append(f"{indent}{assign}")
            else:
                target_c = cond_and(outer_c, op_c)
                chosen = None
                for mc, fld, ast, _ in matches:
                    if mc == target_c:
                        chosen = (fld, ast)
                        break
                if chosen is None:
                    if op_c != TRUE_COND:
                        out.append(f"{indent}if ({cond_to_ts(op_c)}) {{")
                        sub_ind = indent + "  "
                    else:
                        sub_ind = indent
                    for m_i, (mc, fld, ast, _) in enumerate(matches):
                        kw = "if" if m_i == 0 else "else if"
                        out.append(f"{sub_ind}{kw} ({cond_to_ts(mc)}) {{ obj.{fname} = {ast_to_get(ast)}; }}")
                    if op_c != TRUE_COND:
                        out.append(f"{indent}}}")
                else:
                    fld, ast = chosen
                    g_expr = ast_to_get(ast)
                    if arr_idx is not None:
                        assign = f"(obj.{fname} ??= [])[{arr_idx}] = {g_expr};" if not is_field_required(fname) else f"obj.{fname}[{arr_idx}] = {g_expr};"
                    else:
                        assign = f"obj.{fname} = {g_expr};"
                    if op_c != TRUE_COND:
                        out.append(f"{indent}if ({cond_to_ts(op_c)}) {{ {assign} }}")
                    else:
                        out.append(f"{indent}{assign}")

    if len(get_blocks) == 1:
        outer_c, ops = get_blocks[0]
        if outer_c == TRUE_COND:
            emit_ops(ops, outer_c, "  ")
        else:
            out.append(f"  if ({cond_to_ts(outer_c)}) {{")
            emit_ops(ops, outer_c, "    ")
            out.append("  }")
    else:
        for idx, (outer_c, ops) in enumerate(get_blocks):
            kw = "if" if idx == 0 else "else if"
            out.append(f"  {kw} ({cond_to_ts(outer_c)}) {{")
            emit_ops(ops, outer_c, "    ")
            out.append("  }")
    out.append("  return obj;")


def write_registry_and_indices(
    system_events: list[EventIdEntry],
    client_events: list[EventIdEntry],
    all_structs: dict[str, StructDecl],
    all_typedefs: dict[str, TopTypedef],
    is_user_class_map: dict[str, bool],
    symbol_owner: dict[str, str],
) -> None:
    pkt_dir = OUT_ROOT / "packets"

    all_packet_names = sorted(set(all_structs.keys()) | set(all_typedefs.keys()))
    by_mod: dict[str, list[str]] = {}
    for nm in all_packet_names:
        owner = symbol_owner.get(nm)
        if owner:
            by_mod.setdefault(owner, []).append(nm)

    rlines: list[str] = [
        "// Auto-generated Packet Codec & EventID Payload Registry — DO NOT EDIT MANUALLY.",
        "import { KSerBuffer } from '../runtime/ser-buffer.ts';",
        "import { KSerializer, type GetCodec, type PutCodec } from '../runtime/serializer.ts';",
        "import {",
        "  createKEvent,",
        "  decodeKEventPayload,",
        "  getKEvent,",
        "  putKEvent,",
        "  setKEventData,",
        "  type KEvent,",
        "} from '../runtime/event.ts';",
        "import type { UInt16, UInt32, UidType } from '../runtime/types.ts';",
        "import { resolveFlags } from '../flags/presets.ts';",
        "import type { FlagInput } from '../flags/server-flags.ts';",
        "import { EventID } from '../events/index.ts';",
    ]
    for mod in sorted(by_mod.keys()):
        syms = by_mod[mod]
        rlines.append(f"import * as {mod.replace('-', '_')} from './{mod}.ts';")

    rlines.extend(
        [
            "",
            "export interface PacketCodecEntry<T = unknown> {",
            "  readonly name: string;",
            "  readonly isUserClass: boolean;",
            "  readonly isUserClassFor?: (flags?: FlagInput) => boolean;",
            "  readonly create: (flags?: FlagInput) => T;",
            "  readonly put: PutCodec<T, FlagInput>;",
            "  readonly get: GetCodec<T, FlagInput>;",
            "}",
            "",
            "export const PACKET_CODECS: Readonly<Record<string, PacketCodecEntry>> = {",
        ]
    )
    for mod in sorted(by_mod.keys()):
        ns = mod.replace("-", "_")
        for nm in by_mod[mod]:
            is_uc = "true" if is_user_class_map.get(nm, False) else "false"
            extra = ""
            sd_opt = all_structs.get(nm)
            if sd_opt and sd_opt.mixed_typedef_variants:
                # mixed struct vs primitive/STL (e.g. KEGS_GET_SHARE_BANK_REQ)
                non_uc_conds = " || ".join(cond_to_ts(vc, "f") for vc, _ in sd_opt.mixed_typedef_variants)
                extra = f", isUserClassFor: (flags) => {{ const f = resolveFlags(flags); return !({non_uc_conds}); }}"
            rlines.append(
                f"  {nm}: {{ name: '{nm}', isUserClass: {is_uc}{extra}, "
                f"create: {ns}.create{nm} as (flags?: FlagInput) => unknown, "
                f"put: {ns}.put{nm} as PutCodec<unknown, FlagInput>, "
                f"get: {ns}.get{nm} as GetCodec<unknown, FlagInput> }},"
            )
    rlines.append("};")
    rlines.append("")

    # Build EventID -> PacketName mapping
    all_events = system_events + client_events
    rlines.append("export const EVENT_TO_PACKET_NAME: Readonly<Partial<Record<number, string>>> = {")
    for e in all_events:
        cand = "K" + e.name
        if cand in symbol_owner:
            rlines.append(f"  [EventID.{e.name}]: '{cand}',")
    rlines.append("};")
    rlines.append("")

    rlines.extend(
        [
            "function entryIsUserClass(entry: PacketCodecEntry, flags?: FlagInput): boolean {",
            "  return entry.isUserClassFor ? entry.isUserClassFor(flags) : entry.isUserClass;",
            "}",
            "",
            "export function getPacketCodec(packetName: string): PacketCodecEntry | undefined {",
            "  return PACKET_CODECS[packetName];",
            "}",
            "",
            "export function getEventCodec(eventId: number): PacketCodecEntry | undefined {",
            "  const pktName = EVENT_TO_PACKET_NAME[eventId];",
            "  return pktName !== undefined ? PACKET_CODECS[pktName] : undefined;",
            "}",
            "",
            "export function encodePacket<T>(",
            "  packetName: string,",
            "  data: T,",
            "  options?: { flags?: FlagInput; tagging?: boolean },",
            "): Uint8Array {",
            "  const entry = PACKET_CODECS[packetName];",
            "  if (!entry) {",
            "    throw new Error(`Unknown packet codec: ${packetName}`);",
            "  }",
            "  const buf = new KSerBuffer();",
            "  const ks = new KSerializer();",
            "  ks.BeginWriting(buf, options?.tagging ?? false);",
            "  if (entryIsUserClass(entry, options?.flags)) {",
            "    ks.putUserClass(data, entry.put, options?.flags);",
            "  } else {",
            "    entry.put(ks, data, options?.flags);",
            "  }",
            "  ks.EndWriting();",
            "  return buf.toUint8Array();",
            "}",
            "",
            "export function decodePacket<T = unknown>(",
            "  packetName: string,",
            "  bytes: Uint8Array,",
            "  options?: { flags?: FlagInput; tagging?: boolean },",
            "): T {",
            "  const entry = PACKET_CODECS[packetName];",
            "  if (!entry) {",
            "    throw new Error(`Unknown packet codec: ${packetName}`);",
            "  }",
            "  const buf = new KSerBuffer(bytes);",
            "  const ks = new KSerializer();",
            "  ks.BeginReading(buf, options?.tagging ?? false);",
            "  const value = entryIsUserClass(entry, options?.flags)",
            "    ? ks.getUserClass(entry.get, options?.flags)",
            "    : entry.get(ks, options?.flags);",
            "  ks.EndReading();",
            "  return value as T;",
            "}",
            "",
            "export function buildEvent<T = unknown>(",
            "  eventId: UInt16,",
            "  data?: T,",
            "  options?: {",
            "    dwPerformerID?: UInt32;",
            "    trace?: readonly [UidType, UidType] | null;",
            "    flags?: FlagInput;",
            "    tagging?: boolean;",
            "    compress?: boolean;",
            "  },",
            "): KEvent {",
            "  const ev = createKEvent();",
            "  const performerId = options?.dwPerformerID ?? 0;",
            "  const trace = options?.trace ?? null;",
            "  if (data === undefined) {",
            "    return setKEventData(ev, performerId, trace, eventId);",
            "  }",
            "  const entry = getEventCodec(eventId);",
            "  if (!entry) {",
            "    throw new Error(`No payload codec registered for EventID ${eventId}`);",
            "  }",
            "  ev.m_kDestPerformer.m_dwPerformerID = performerId;",
            "  ev.m_usEventID = eventId;",
            "  ev.m_anTrace = trace ? [trace[0], trace[1]] : [-1n, -1n];",
            "  ev.m_kbuff.Clear();",
            "  const ks = new KSerializer();",
            "  ks.BeginWriting(ev.m_kbuff, options?.tagging ?? false);",
            "  if (entryIsUserClass(entry, options?.flags)) {",
            "    ks.putUserClass(data, entry.put, options?.flags);",
            "  } else {",
            "    entry.put(ks, data, options?.flags);",
            "  }",
            "  ks.EndWriting();",
            "  if (options?.compress) {",
            "    ev.m_kbuff.Compress();",
            "  }",
            "  return ev;",
            "}",
            "",
            "export function decodeEvent<T = unknown>(",
            "  event: KEvent,",
            "  options?: { flags?: FlagInput; tagging?: boolean; uncompress?: boolean },",
            "): T | undefined {",
            "  if (event.m_kbuff.GetLength() === 0) return undefined;",
            "  const entry = getEventCodec(event.m_usEventID);",
            "  if (!entry) {",
            "    throw new Error(`No payload codec registered for EventID ${event.m_usEventID}`);",
            "  }",
            "  if (entryIsUserClass(entry, options?.flags)) {",
            "    return decodeKEventPayload(event, entry.get, options) as T;",
            "  }",
            "  const buf = new KSerBuffer(event.m_kbuff);",
            "  if (options?.uncompress !== false && buf.m_bCompress) buf.UnCompress();",
            "  buf.Reset();",
            "  const ks = new KSerializer();",
            "  ks.BeginReading(buf, options?.tagging ?? false);",
            "  const val = entry.get(ks, options?.flags);",
            "  ks.EndReading();",
            "  return val as T;",
            "}",
            "",
            "export function serializeKEvent(event: KEvent, options?: { tagging?: boolean }): Uint8Array {",
            "  const buf = new KSerBuffer();",
            "  const ks = new KSerializer();",
            "  ks.BeginWriting(buf, options?.tagging ?? false);",
            "  ks.putUserClass(event, putKEvent);",
            "  ks.EndWriting();",
            "  return buf.toUint8Array();",
            "}",
            "",
            "export function deserializeKEvent(bytes: Uint8Array, options?: { tagging?: boolean }): KEvent {",
            "  const buf = new KSerBuffer(bytes);",
            "  const ks = new KSerializer();",
            "  ks.BeginReading(buf, options?.tagging ?? false);",
            "  const ev = ks.getUserClass(getKEvent);",
            "  ks.EndReading();",
            "  return ev;",
            "}",
            "",
        ]
    )
    (pkt_dir / "registry.ts").write_text("\n".join(rlines), encoding="utf-8")

    # packets/index.ts
    (pkt_dir / "index.ts").write_text(
        "\n".join(
            [
                "export * from './common-packet.ts';",
                "export * from './common-packet-global.ts';",
                "export * from './client-packet.ts';",
                "export * from './client-packet-global.ts';",
                "export * from './registry.ts';",
                "",
            ]
        ),
        encoding="utf-8",
    )

    # root src/index.ts
    (OUT_ROOT / "index.ts").write_text(
        "\n".join(
            [
                "export * from './runtime/index.ts';",
                "export * from './flags/index.ts';",
                "export * from './events/index.ts';",
                "export * from './packets/index.ts';",
                "",
            ]
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
