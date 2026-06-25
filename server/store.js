import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')

/**
 * Tiny JSON-file persistence layer.
 *
 * Reads are parsed fresh from disk each call so external edits are picked up,
 * and writes are serialized through a per-file promise chain so concurrent
 * requests can't interleave and corrupt the file.
 */
const writeLocks = new Map()

function pathFor(name) {
  return join(dataDir, `${name}.json`)
}

export async function readCollection(name) {
  const raw = await readFile(pathFor(name), 'utf8')
  return JSON.parse(raw)
}

export async function writeCollection(name, data) {
  const previous = writeLocks.get(name) ?? Promise.resolve()
  const next = previous
    .catch(() => {})
    .then(() => writeFile(pathFor(name), JSON.stringify(data, null, 2) + '\n'))
  writeLocks.set(name, next)
  return next
}
