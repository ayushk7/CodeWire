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

- **Domain folders:** Use lowercase for domain group folders under `src/js/` (e.g. `core`, `nodes`, `registry`, `compiler`, `editor`, `ui`, `persistence`).
- **JavaScript files:** Use camelCase (e.g. `nodeFactory.js`, `contextMenu.js`, `stage.js`, `saveAndLoad.js`). Match the main export or feature name. Use `index.js` for module entry points.
- **App layout:** App source lives under `src/`: entry point `src/index.html`, styles and images in `src/`, app JavaScript in `src/js/` (domain folders as above), app entry point at `src/js/app.js`. Third-party libraries live in `src/vendor/` (e.g. `codemirror`, `jquery`, `konva`). Use lowercase for vendor subfolders to avoid case-sensitivity issues.
- **Avoid:** Typos in filenames; mixing casing for the same concept (e.g. `Dependencies` vs `dependencies`).

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
