#include <cstdio>
#include <cstring>
#include <string>
#include "../src/core/EventIDs.h"
#include "../src/core/NetError.h"
#include "../src/core/Region.h"
#include "../src/core/SerBuffer.h"
#include "../src/core/Serializer.h"
#include "../src/db/GameStore.h"
#include "../src/db/Sqlite.h"
#include "../src/server/GetNextInventoryEdProtocol.h"
using namespace x2; using namespace x2::db; using namespace x2::get_next_inventory_ed;
namespace {
int passed=0, failed=0;
#define CHECK(c) do { if (c) ++passed; else { ++failed; std::printf("inventory quote FAIL line %d\n", __LINE__); } } while (0)
struct InventoryQuoteFixture {
 Database db; GameStore store; std::string err; int64_t uid=0;
 InventoryQuoteFixture():store(db) { GUserRecord user; if (!db.Open(":memory:",err)||!ApplyGameMigrations(db,err)||!store.GetOrCreateGUser(9731,"inventory_quote_user",user,err)) return; store.CreateUnit(9731,"inv_quote_unit",1,uid,err); }
 bool set(int cat,int n) { return db.Exec("DELETE FROM giteminventorysize WHERE UnitUID="+std::to_string(uid)+" AND InventoryCategory="+std::to_string(cat)+"; INSERT INTO giteminventorysize(UnitUID,InventoryCategory,NumSlot) VALUES("+std::to_string(uid)+","+std::to_string(cat)+","+std::to_string(n)+");",err); }
};
void TestCodec() {
 CHECK(static_cast<int>(EventID::EGS_GET_NEXT_INVENTORY_ED_REQ)==1145 && static_cast<int>(EventID::EGS_GET_NEXT_INVENTORY_ED_ACK)==1146);
 CHECK(ERR_EXPAND_INVENTORY_ED_02==1356 && ERR_EXPAND_INVENTORY_ED_03==1357);
 SerBuffer b; Serializer s; GetNextInventoryEdReq req;
 CHECK(s.BeginWriting(&b) && PutGetNextInventoryEdReq(s,req)); s.EndWriting(); CHECK(b.GetLength()==0);
 Serializer reader; CHECK(reader.BeginReading(&b) && GetGetNextInventoryEdReq(reader,req)); reader.EndReading();
 GetNextInventoryEdAck ack; ack.iED=5000000;
 CHECK(s.BeginWriting(&b) && PutGetNextInventoryEdAck(s,ack)); s.EndWriting();
 const unsigned char expected[]={0,0,0,0,0,0x4c,0x4b,0x40}; CHECK(b.GetLength()==8 && std::memcmp(b.GetData(),expected,8)==0);
 GetNextInventoryEdAck decoded; CHECK(reader.BeginReading(&b) && GetGetNextInventoryEdAck(reader,decoded)); reader.EndReading(); CHECK(decoded.iOK==0 && decoded.iED==5000000);
}
void TestHandler() {
 InventoryQuoteFixture f; GetNextInventoryEdAck a; CHECK(f.uid>0);
 CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==NET_OK && a.iED==5000000);
 CHECK(f.set(1,8)); CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==NET_OK && a.iED==10000000);
 CHECK(f.set(1,17)); CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==NET_OK && a.iED==24000000);
 CHECK(f.set(1,24)); CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==NET_OK && a.iED==75000000);
 CHECK(f.set(4,24)); const bool special24=CurrentRegion()==Region::TW||CurrentRegion()==Region::HK||CurrentRegion()==Region::CN||CurrentRegion()==Region::US||CurrentRegion()==Region::TH||CurrentRegion()==Region::PH;
 CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==(special24 ? NET_OK : ERR_EXPAND_INVENTORY_ED_02));
 CHECK(f.set(4,0)); CHECK(f.set(1,0));
 for (int cat=1; cat<=6; ++cat) {
   CHECK(f.set(cat,56));
   CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==ERR_EXPAND_INVENTORY_ED_02 && a.iED==0);
   CHECK(f.set(cat,0));
 }
 CHECK(f.set(1,32)); const bool twhk=CurrentRegion()==Region::TW||CurrentRegion()==Region::HK;
 CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==(twhk ? ERR_EXPAND_INVENTORY_ED_03 : ERR_EXPAND_INVENTORY_ED_02)); CHECK(a.iED==0);
 CHECK(HandleGetNextInventoryEdReq(f.store,0,a,f.err)==ERR_ODBC_01 && !f.err.empty());
 CHECK(HandleGetNextInventoryEdReq(f.store,f.uid+999,a,f.err)==ERR_ODBC_01);
 CHECK(f.db.Exec("DROP TABLE giteminventorysize;",f.err)); CHECK(HandleGetNextInventoryEdReq(f.store,f.uid,a,f.err)==ERR_ODBC_01 && !f.err.empty());
}
}
void RunGetNextInventoryEdTestsByRef(int& pass,int& fail) { TestCodec(); TestHandler(); pass+=passed; fail+=failed; std::printf("GetNextInventoryEd: %d passed, %d failed\n",passed,failed); }
