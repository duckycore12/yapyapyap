const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const hotDir = path.join(app.getPath('userData'), 'yapyapyap-hot');
const hotMain = path.join(hotDir, 'main.js');
const bundledMain = path.join(__dirname, 'main.js');

process.env.YAPYAPYAP_HOT_DIR = hotDir;
process.env.YAPYAPYAP_APP_DIR = __dirname;

let chosenMain = bundledMain;
if (fs.existsSync(hotMain)) {
  try {
    new Function(fs.readFileSync(hotMain, 'utf-8'));
    chosenMain = hotMain;
  } catch (e) {
    console.error('[YAP YAP YAP Bootstrap] Hot main.js is invalid, falling back to bundled:', e);
  }
}

try {
  const code = fs.readFileSync(chosenMain, 'utf-8');
  const Module = require('module');
  const m = new Module(chosenMain, module);
  m.filename = chosenMain;
  m.paths = Module._nodeModulePaths(path.dirname(chosenMain));
  m._compile(code, chosenMain);
} catch (e) {
  if (chosenMain !== bundledMain) {
    try {
      const code = fs.readFileSync(bundledMain, 'utf-8');
      const Module = require('module');
      const m = new Module(bundledMain, module);
      m.filename = bundledMain;
      m.paths = Module._nodeModulePaths(path.dirname(bundledMain));
      m._compile(code, bundledMain);
    } catch (err) {
      console.error('[YAP YAP YAP Bootstrap] Failed to load bundled main.js:', err);
    }
  }
}
