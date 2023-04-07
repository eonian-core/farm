# Known Development Issues

## Installation of dependencies

Fail during installation of dependency in one of the packages.
Example `error An unexpected error occurred: "expected workspace package to exist for \"yargs\"".`

Issue still not fixed by yarn: https://github.com/yarnpkg/yarn/issues/7734.

### Solution

Go to the root directory and run `yarn workspace [package-name] add ...` to add the package. Use `@eonian/web` as the package name for the web package and `@eonian/contracts` for the contracts package.

## Graphql types code generation

Fail during code generation of graphql types.
Example:

```bash
Cannot use GraphQLScalarType "BigDecimal" from another module or realm.
Ensure that there is only one instance of "graphql" in the node_modules
```

Remove `nohoist` from the root `package.json`, delete node_modules in root and all packages, and run `yarn` again. Be aware, removing `nohoist` can cause failures in contracts package.
