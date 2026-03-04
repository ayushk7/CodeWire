# CodeWire – Branch & Commit Conventions

## Branch names

Use lowercase with a type prefix and short description:

- **Format:** `type/short-description` (e.g. `feature/node-registry`, `fix/context-menu`)
- **Allowed types:** `feature`, `fix`, `chore`, `docs`, `refactor`, `test`
- **Protected:** `master` and `main` are allowed as-is (no validation when pushing them)

**Examples:** `feature/visual-script-export`, `fix/compiler-edge-case`, `chore/deps`

---

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

- **Format:** `type(scope): short description` or `type: short description`
- **Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`, `perf`
- **Scope (optional):** e.g. `feat(nodes): add custom node type`
- **Length:** First line should be under 72 characters.

**Examples:**
- `feat: add node registry and definitions`
- `fix(compiler): handle empty script output`
- `chore: update dependencies`

---

## File and folder naming

- **Feature folders:** Use PascalCase for app feature modules (e.g. `Nodes`, `ContextMenu`, `NodeRegistry`, `SetLocationOfNode`). Use lowercase for non-feature folders (e.g. `main`, `dependencies`, `scripts`).
- **JavaScript files:** Use camelCase (e.g. `alertBox.js`, `contextMenu.js`, `initStage.js`, `inputBox.js`, `saveAndLoad.js`). Match the main export or feature name. Use `index.js` for module entry points.
- **Third-party / assets:** Keep the `javascript/dependencies/` folder (lowercase) for CodeMirror, jQuery, Konva, etc. Use lowercase for subfolders (e.g. `codemirror`, `konva`) to avoid case-sensitivity issues on Linux/macOS.
- **Avoid:** Typos in filenames (e.g. `intiStage` → `initStage`); mixing casing for the same concept (e.g. `Dependencies` vs `dependencies`).

---

## Enforcing conventions

After cloning the repo, install the Git hooks once:

```bash
npm run setup:hooks
```

This installs:

- **commit-msg** – Rejects commits that don’t match the commit message format.
- **pre-push** – Rejects pushes if the current branch name doesn’t match the branch format (except when pushing `master` or `main`).

To skip hook checks in rare cases (e.g. emergency fix):  
`git commit --no-verify` or `git push --no-verify` (use sparingly).
