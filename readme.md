# Package.json From Template

> Generate a package.json file from a template

## Why

- You might find this project useful if you need to generate a node module with different dependencies which uses a different package.json configuration from your repository configuration
- It saves you time
- It's DRY

## When to use it

Sometimes you create a repository that generates a packaged version of your
project and you want that to have it own `package.json` file but the same
name and version inherited from your original project.

## Install

If you want to install package-json-from-template globally,
use the follow command from your terminal:

```
$ npm install -g package-json-from-template
```

Otherwise just add PackageJsonFromTemplate to your project with:

```
$ npm install --save-dev package-json-from-template
```

If you prefer using Yarn:

```
$ yarn add --dev package-json-from-template
```

## Usage

```txt
  $ Usage: pack-gen [path] [options] -- [diff args]

  Options
    -t, --template=<filename>   The template file to be used for generating the new package.json file. [default: <path>/package.tpl.json]

    -s, --source=<filename>     The location of your `package.json` file. [default: the root project directory will be used]

  [path]  The working directory in where generating package.json file

  Examples
  Generate a new package.json file inside the ./package folder
  $ pack-gen package

  Generate a new package.json using the base package.json file located under the src directory
  $ pack-gen package --source=src/package.json

  Generate a new package.json file inside the ./package folder using a my-template.json file as a template
  $ pack-gen package --template=my-template.json
```

## Example

Now, assuming that your project generate a distribution version
of your node module inside a `dist` folder, add a `pack-gen` script
to generate a `package.json` file inside that directory to
call after your build task is completed.

```json
"scripts": {
  "pack-gen": "pack-gen ./dist",
}
```

Note that your `dist` folder will need to contain a
`package.tpl.json` file to use as a template.
If you wish to use a template file sitting elsewhere, you can use
the `template` flag and specify a different path like this:

```json
"scripts": {
  "pack-gen": "pack-gen ./dist --template=/templates/my-package.teplate.json",
}
```

## Contributing

1.  Fork it!
1.  Create your feature branch: `git checkout -b my-new-feature`
1.  Add your changes: `git add .`
1.  Commit your changes: `git commit -am 'Add some feature'`
1.  Push to the branch: `git push origin my-new-feature`
1.  Submit a pull request :sunglasses:

## License

[MIT License](https://andreasonny.mit-license.org/2017) © SonnY
