# SAPUI5-POC

To check performance and basic features of SAPUI5 components

Usefule Links:

* [UI5 Tooling](https://sap.github.io/ui5-tooling/)
* [UI5 Migration Tooling](https://github.com/SAP/ui5-migration)

## Getting Started

Before starting to work with the project, run the following command once:

```zsh
# Install the NPM packages
npm install
```

### Developing

To start the development server incl. livereload, just run the following command:

```zsh
# Run the UI5 server on the source + livereload
npm run start:dev
```

Now you can edit your source files and the application immediately gets updated.

*Some remarks*:

The project allows you to use ES6 language features and will use Babel to transpile the ES6 code to ES5. See the `Component.js` or the `BaseController.js`.

Additionally, a very rudimentary code completion support has been added. Also see the `Component.js` or the `BaseController.js`. On top, for the AMD modules you can play around with code completion for the imports.

### Testing

To run ESLint as well as QUnit and OPA5 tests with Karma, just run the following command:

```zsh
# Run ESLint, QUnit, OPA5
npm test
```

It is also possible to add Istanbul code coverage to the project or even run E2E tests with Cypress, Nightwatch, ...

*Some remarks*:

As the QUnit and OPA5 tests are not adopted for the project, they do not successfully run right now.

### Running

In order to run the final application (with the build results), just run the following command:

```zsh
# Run the preload builds, self-contained build and copy step for the mockdata
npm run build
```

This triggers a build for the libraries and the component as well as creating a self contained build for the complete application. 

The build application can now be started with one of the following commands:

```zsh
# Run the UI5 server on dist
npm run start

# Alternative solution to use UI5 server on dist with http2
npm run start:dist-h2

# Alternative solution to use simple HTTP serve command w/o UI5
npm run serve
```

*Some remarks*:

Use the `npm run serve` command to be pretty similar to GH pages.

### Migrating

To upgrade the UI5 code, you can use the migration tools via:

```zsh
# Run UI5 migration tools
npm upgrade-code
```

*Some remarks*:

Revert the modification to the webapp/test resources. Those resources should not be migrated to AMD-like modules.

## Deploy to gh-pages

If you want to deploy this repository to gh-pages just run the following command:

```zsh
# Deploys the content of the dist folder to gh-pages
npx deploy-to-gh-pages dist --local
```
