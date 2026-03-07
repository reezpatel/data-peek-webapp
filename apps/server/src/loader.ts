/**
 * Node.js module resolution hook.
 * Intercepts Electron-specific imports from ANY source and redirects to our
 * CJS shims. This is needed because pnpm strict mode would otherwise resolve
 * 'electron-log' from apps/desktop/node_modules (the real package).
 */
import { pathToFileURL } from 'node:url'
import { resolve as pathResolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const shimsDir = pathResolve(__dirname, '..', 'shims')

const SHIM_MAP: Record<string, string> = {
  'electron': pathResolve(shimsDir, 'electron', 'index.js'),
  'electron-log/main': pathResolve(shimsDir, 'electron-log', 'main.js'),
  'electron-store': pathResolve(shimsDir, 'electron-store', 'index.js'),
}

export async function resolve(
  specifier: string,
  context: { parentURL?: string; conditions: string[] },
  nextResolve: (specifier: string, context: any) => Promise<any>
): Promise<any> {
  if (specifier in SHIM_MAP) {
    return {
      shortCircuit: true,
      url: pathToFileURL(SHIM_MAP[specifier]).href,
      format: 'commonjs'
    }
  }

  return nextResolve(specifier, context)
}
