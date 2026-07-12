import shutil
import os
from datetime import datetime

DB_PATH = "../KontaktyAPI/crm.db"
ZALOHY_SLOZKA = "vystupy/zalohy"

def vytvor_zalohu():
    os.makedirs(ZALOHY_SLOZKA, exist_ok=True)
    nazev = f"crm_zaloha_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
    cesta = os.path.join(ZALOHY_SLOZKA, nazev)
    shutil.copy2(DB_PATH, cesta)
    return cesta
