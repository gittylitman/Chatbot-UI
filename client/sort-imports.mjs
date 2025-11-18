import fs from 'fs';
import path from 'path';

function getImportName(imp) {
    let match = imp.match(/import\s+([A-Za-z0-9_]+)/);
    if (match) return match[1];
    match = imp.match(/{\s*([A-Za-z0-9_]+)/);
    if (match) return match[1];
    match = imp.match(/['"]([^'"]+)['"]/);
    return match ? match[1] : '';
}

function sortImports(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');

    const importRegex = /^import\s.+?;$/gm;
    const imports = code.match(importRegex) || [];

    const groups = {
        noFrom: [],
        extUpper: [],
        extLower: [],
        intUpper: [],
        intLower: [],
    };

    for (const imp of imports) {
        const fromMatch = imp.match(/from\s+['"]([^'"]+)['"]/);
        const bareImport = !fromMatch;
        if (bareImport) {
            groups.noFrom.push(imp);
            continue;
        }
        const source = fromMatch[1];
        const isInternal = source.startsWith('.') || source.startsWith('/');
        const name = getImportName(imp);
        if (!isInternal) {
            if (/^[A-Z]/.test(name)) groups.extUpper.push(imp);
            else groups.extLower.push(imp);
        } else {
            if (/^[A-Z]/.test(name)) groups.intUpper.push(imp);
            else groups.intLower.push(imp);
        }
    }

    const sortFn = (a, b) => {
        const nameA = getImportName(a);
        const nameB = getImportName(b);
        return nameA.localeCompare(nameB);
    };

    Object.keys(groups).forEach(k => groups[k].sort(sortFn));

    const finalImports = [
        ...groups.noFrom,
        ...groups.extUpper,
        ...groups.extLower,
        ...(groups.intUpper.length || groups.intLower.length ? [''] : []),
        ...groups.intUpper,
        ...groups.intLower,
    ].filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''));

    code = code.replace(importRegex, '').trimStart();
    code = finalImports.join('\n') + '\n\n' + code;

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`✅ Sorted imports in ${filePath}`);
}

function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
            sortImports(fullPath);
        }
    }
}

if (process.argv.length < 3) {
    console.error('Usage: node sort-imports.mjs <folder-or-file-path>');
    process.exit(1);
}
const targetPath = path.resolve(process.argv[2]);
if (fs.statSync(targetPath).isDirectory()) {
    processDirectory(targetPath);
} else {
    sortImports(targetPath);
}
