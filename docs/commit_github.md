# Conventional Commit Keywords

## Commit Format

```bash
type(scope): message
```

Example:

```bash
feat(auth): add Google login
fix(api): resolve token expiration bug
```

---

## Common Commit Types

| Type | Meaning | Example |
|------|----------|----------|
| `feat` | Add new feature | `feat: add dashboard page` |
| `fix` | Fix bug | `fix: correct login validation` |
| `docs` | Documentation changes | `docs: update README` |
| `style` | Code style/formatting changes | `style: format code with prettier` |
| `refactor` | Refactor code without changing behavior | `refactor: simplify user service` |
| `perf` | Performance improvements | `perf: optimize database query` |
| `test` | Add or update tests | `test: add unit tests for API` |
| `build` | Build system or dependency changes | `build: update webpack config` |
| `ci` | CI/CD configuration changes | `ci: add GitHub Actions workflow` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `revert` | Revert previous commit | `revert: revert authentication changes` |

---

## AI / Data Science Commit Examples

```bash
feat: add CNN model for image classification
fix: handle missing values in dataset
refactor: optimize preprocessing pipeline
test: add evaluation metrics tests
docs: update model training guide
```

---

## Web Development Commit Examples

```bash
feat: add dark mode
fix: responsive navbar issue
style: improve button spacing
perf: reduce image loading time
```

---

## CI/CD Commit Examples

```bash
ci: add auto deploy workflow
ci: fix failing test pipeline
```

---

## Good Commit Messages

```bash
feat: add JWT authentication
fix: resolve memory leak in crawler
docs: update installation instructions
```

---

## Bad Commit Messages

```bash
update
fix bug
new code
aaaa
```

---

## Professional GitHub Commit Tips

- Write commit messages in English
- Use present tense verbs:
  - `add`
  - `fix`
  - `update`
  - `remove`
- Keep messages short and clear
- One commit should represent one main change

---

## Example Git Workflow

```bash
git add .
git commit -m "feat: add lung disease prediction model"
git push
```

Or:

```bash
git commit -m "fix: correct data normalization bug"
```