/**
 * CJS require hook that intercepts Electron-specific module resolution.
 * This runs before any imports and patches Module._resolveFilename to
 * redirect electron, electron-log, and electron-store to our shims.
 */
const Module = require('node:module')
const path = require('node:path')

const shimsDir = path.resolve(__dirname, '..', 'shims')

const SHIM_MAP = {
  'electron': path.resolve(shimsDir, 'electron', 'index.js'),
  'electron-log/main': path.resolve(shimsDir, 'electron-log', 'main.js'),
  'electron-store': path.resolve(shimsDir, 'electron-store', 'index.js'),
}

const originalResolve = Module._resolveFilename
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request in SHIM_MAP) {
    return SHIM_MAP[request]
  }
  return originalResolve.call(this, request, parent, isMain, options)
}
