CREATE TABLE default_schema (
  schema_id SERIAL PRIMARY KEY,
  created TIMESTAMPTZ DEFAULT NOW(),
  archived TIMESTAMPTZ DEFAULT NOW()
);