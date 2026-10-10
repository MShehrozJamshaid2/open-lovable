import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildComponentTree, parseJavaScriptFile } from '../lib/file-parser.ts';
import type { FileInfo } from '../types/file-manifest.ts';

const componentSource = [
  "import {",
  '  Header,',
  '  Footer,',
  "} from './layout';",
  'import Sidebar, {',
  '  Menu',
  "} from './Sidebar';",
  'export default function App() { return <><Header /><Sidebar /><Footer /></>; }',
].join('\n');

test('parses imports that Prettier wraps across multiple lines', () => {
  const { imports } = parseJavaScriptFile(componentSource, 'src/App.tsx');

  assert.ok(imports, 'imports should be extracted');
  assert.equal(imports.length, 2);

  assert.equal(imports[0].source, './layout');
  assert.deepEqual(imports[0].imports, ['Header', 'Footer']);
  assert.equal(imports[0].isLocal, true);

  assert.equal(imports[1].source, './Sidebar');
  assert.equal(imports[1].defaultImport, 'Sidebar');
});

test('parses single-line imports', () => {
  const source = [
    "import { Header, Footer } from './layout';",
    "import Sidebar from './Sidebar';",
    'export default function App() { return null; }',
  ].join('\n');

  const { imports } = parseJavaScriptFile(source, 'src/App.tsx');

  assert.equal(imports?.length, 2);
  assert.equal(imports?.[0].source, './layout');
  assert.deepEqual(imports?.[0].imports, ['Header', 'Footer']);
  assert.equal(imports?.[1].defaultImport, 'Sidebar');
});

test('keeps a side-effect import separate from the next import', () => {
  const source = [
    "import './globals.css';",
    "import { Header } from './layout';",
    'export default function App() { return <Header />; }',
  ].join('\n');

  const { imports } = parseJavaScriptFile(source, 'src/App.tsx');

  assert.equal(imports?.length, 2);
  assert.equal(imports?.[0].source, './globals.css');
  assert.equal(imports?.[1].source, './layout');
  assert.deepEqual(imports?.[1].imports, ['Header']);
});

test('ignores imports that are commented out or quoted inside strings', () => {
  const source = [
    "import { Header } from './layout';",
    "// import Footer from './Footer'; // Not used in current implementation",
    'const sample = `',
    "  import Widget from './Widget';",
    '`;',
    'export default function App() { return <Header />; }',
  ].join('\n');

  const { imports } = parseJavaScriptFile(source, 'src/App.tsx');

  assert.equal(imports?.length, 1);
  assert.equal(imports?.[0].source, './layout');
});

test('buildComponentTree links components across multi-line imports', () => {
  const files: Record<string, FileInfo> = {
    'src/App.tsx': {
      ...parseJavaScriptFile(componentSource, 'src/App.tsx'),
      content: componentSource,
      path: 'src/App.tsx',
      relativePath: 'App.tsx',
      lastModified: 0,
    } as FileInfo,
    'src/Sidebar.tsx': {
      ...parseJavaScriptFile(
        'export default function Sidebar() { return <nav />; }',
        'src/Sidebar.tsx'
      ),
      content: 'export default function Sidebar() { return <nav />; }',
      path: 'src/Sidebar.tsx',
      relativePath: 'Sidebar.tsx',
      lastModified: 0,
    } as FileInfo,
  };

  const tree = buildComponentTree(files);

  assert.ok(tree.App, 'App should be part of the component tree');
  assert.deepEqual(tree.App.imports, ['Sidebar']);
  assert.deepEqual(tree.Sidebar.importedBy, ['App']);
});
