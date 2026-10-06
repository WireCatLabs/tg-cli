import { chmodSync, closeSync, existsSync, openSync } from "node:fs"
import { type CacheDatabase, openCache, type SqlValue } from "@leemour/cli-messaging/store"
import { BaseSqliteStorage, BaseSqliteStorageDriver, type ISqliteDatabase, type ISqliteStatement } from "@mtcute/node"

/**
 * mtcute's session storage over the SQLite the runtime already has — `node:sqlite` or `bun:sqlite`,
 * through cli-messaging's seam — instead of `better-sqlite3`.
 *
 * Measured 2026-09-27: a global `pnpm add -g` installs `better-sqlite3` without running its install
 * script, so it has no native binding and every login fails with "Could not locate the bindings
 * file". `@mtcute/node` still imports it, but the binding is only loaded when a database is opened
 * (`better-sqlite3/lib/database.js:48`), and this storage never asks it to.
 */
class RuntimeSqliteDriver extends BaseSqliteStorageDriver {
  readonly #database: CacheDatabase

  constructor(database: CacheDatabase) {
    super()
    this.#database = database
  }

  _createDatabase(): ISqliteDatabase {
    const database = this.#database
    let closed = false
    return {
      exec: (sql) => database.exec(sql),
      // On SIGINT/SIGTERM mtcute's exit hook closes the database itself, then `client.destroy()` closes it
      // again (`@mtcute/core` storage/sqlite/driver.js `_load` → `beforeExit`); the second would throw.
      close: () => {
        if (closed) return
        closed = true
        database.close()
      },
      prepare: <P extends unknown[]>(sql: string): ISqliteStatement<P> => {
        const statement = database.prepare(sql)
        return {
          run: (...parameters: P) => {
            statement.run(...(parameters as SqlValue[]))
          },
          get: (...parameters: P) => statement.get(...(parameters as SqlValue[])),
          all: (...parameters: P) => statement.all(...(parameters as SqlValue[])),
        }
      },
      // better-sqlite3's shape: the function comes back wrapped, and runs in one transaction when called.
      // biome-ignore lint/suspicious/noExplicitAny: mtcute's own signature
      transaction: <F extends (...args: any[]) => any>(work: F): F =>
        ((...args: Parameters<F>) => {
          database.exec("BEGIN IMMEDIATE")
          try {
            const result = work(...args)
            database.exec("COMMIT")
            return result
          } catch (error) {
            database.exec("ROLLBACK")
            throw error
          }
        }) as F,
    }
  }
}

/** The session is a login: owner-only, -wal and -shm included. */
export const openSessionStorage = async (path: string): Promise<BaseSqliteStorage> => {
  // SQLite gives -wal and -shm the database file's mode and writes them while it opens, so the file
  // is 0600 before that. The chmod puts right a session made before this was so.
  closeSync(openSync(path, "a", 0o600))
  for (const file of [path, `${path}-wal`, `${path}-shm`]) {
    if (existsSync(file)) chmodSync(file, 0o600)
  }
  return new BaseSqliteStorage(new RuntimeSqliteDriver(await openCache(path)))
}
