// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:Rikuneko_14047258@localhost:5432/quora_api",
});

export default connectionPool;
