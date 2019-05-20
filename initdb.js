const promise = require('bluebird');
const parse = require('pg-connection-string').parse;

module.exports = (config) => {
  const dbConfigs = config.db;
  const appName = config.appName || 'core-graphql-server';
  const dbByUri = {};
  const dbConnections = {};
  const pgp = require('pg-promise')({
    promiseLib: promise,
    connect: (client) => {
      const cp = client.connectionParameters;
      const key = cp.database + ':' + cp.user + ':' + cp.host;
      console.log(`Connected to PG Database: ${key}`);
    },
    disconnect: (client) => {
      const cp = client.connectionParameters;
      const key = cp.database + ':' + cp.user + ':' + cp.host;
      console.log(`Disconnected to PG Database: ${key}`);
    }
  });
  const wrapConnection = (conn, dbname, uri, connKey) => {
    const wrappers = {
      map: function(sql, args, mapfun) {
        return wrap(
          () => conn.map(sql, args, mapfun),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      query: function(sql, args) {
        return wrap(
          () => conn.query(sql, args),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      any: function(sql, args) {
        return wrap(() => conn.any(sql, args), dbname, sql, args, uri, connKey);
      },
      one: function(sql, args, mapfun) {
        return wrap(
          () => conn.one(sql, args, mapfun),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      oneOrNone: function(sql, args, mapfun) {
        return wrap(
          () => conn.oneOrNone(sql, args, mapfun),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      many: function(sql, args) {
        return wrap(
          () => conn.many(sql, args),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      manyOrNone: function(sql, args) {
        return wrap(
          () => conn.manyOrNone(sql, args),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      none: function(sql, args) {
        return wrap(
          () => conn.none(sql, args),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      },
      each: function(sql, args, mapfun) {
        return wrap(
          () => conn.each(sql, args, mapfun),
          dbname,
          sql,
          args,
          uri,
          connKey
        );
      }
    };
    Object.keys(conn).forEach(funcName => {
      if (!Object.keys(wrappers).includes(funcName)) {
        wrappers[funcName] = conn[funcName];
      }
    });

    return wrappers;
  }
  const setupConnection = (key, uri) => {
    const parsed = parse(uri);
    const connKey = parsed.database + ':' + parsed.user + ':' + parsed.host;

    parsed.appication_name = appName;
    parsed.keepAlive = true;
    parsed.idleTimeoutMillis = 5000;
    parsed.max = 30;
    parsed.min = 1;

    const conn = pgp(parsed);

    return wrapConnection(conn, key, uri, connKey);
  };

  Object.keys(dbConfigs).forEach(key => {
    const readUri = dbConfigs[key].read;
    const writeUri = dbConfigs[key].write;
    const conn = {};

    if (readUri) {
      if (!dbByUri[readUri]) {
        dbByUri[readUri] = setupConnection(key, readUri);
      }
      conn.read = dbByUri[readUri];
    }

    if (writeUri) {
      if (!dbByUri[writeUri]) {
        dbByUri[writeUri] = setupConnection(key, writeUri);
      }
      conn.write = dbByUri[writeUri];
    }
    // finally, set up the object for this db key
    dbConnections[key] = conn;
  });

  return dbConnections;
}