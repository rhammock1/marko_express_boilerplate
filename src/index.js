import express from "express";
import compressionMiddleware from "compression";
import markoMiddleware from "@marko/express";
import db from './db';
import indexPage from "./pages/index";

const port = parseInt(process.env.PORT || 3000, 10);

process.on('SIGTERM', async () => {
  console.log('warn', 'Process terminate signal received.');
  try {
    express.close(); // this may not be right
    console.log('SERVER HAS STOPPED ACCEPTING CONNECTIONS');
  } catch (e) {
    console.log('THERE WAS AN ERROR SHUTTING DOWN', e);
  } finally {
    process.exit(0);
  }
});

const migrate = async () => {
  console.log('warn', 'Running migration script');
  try {
    await db.upgrade('./src/db', 'db_migrate');
  } catch (e) {
    console.log('error in migrate', e);
    await db.end();
    console.log('Shutting down with error');
    process.exit(1);
  }
};

express()
  .use(compressionMiddleware()) // Enable gzip compression for all HTTP responses.
  .use("/assets", express.static("dist/assets")) // Serve assets generated from webpack.
  .use(markoMiddleware()) // Enables res.marko.
  .get("/", indexPage)
  .listen(port, async (err) => {
    if (err) {
      throw err;
    }

    await migrate();
    await db.load();

    if (port) {
      console.log(`Listening on port ${port}`);
    }
  });
