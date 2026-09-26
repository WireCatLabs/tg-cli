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
    return {
      exec: (sql) => database.exec(sql),
      close: () => database.close(),
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

export const openSessionStorage = async (path: string): Promise<BaseSqliteStorage> =>
  new BaseSqliteStorage(new RuntimeSqliteDriver(await openCache(path)))
