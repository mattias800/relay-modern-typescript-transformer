# relay-modern-typescript-transformer
A Typescript transformer that transforms GraphQL queries to require functions.

# Tutorial

### Install with Yarn (or NPM)

```bash
$ yarn add relay-modern-typescript-transformer
$ yarn add relay-compiler
```

`relay-compiler` is used to compile the queries into optimized .graphql files.

Read the Relay Modern docs for more info.

### Add transform to Typescript config

For `fuse-box`, just add:

```js
const { transformer } = require('relay-modern-typescript-transformer');
```

And then:

```
fuse = FuseBox.init(
    {
      ...
      transformers: {
        before: [
          transformer,
        ],
      },
    });
``` 

### Run relay-compiler on your sources

```
./node_modules/.bin/relay-compiler --src ./src --schema ./src/data/schema.json --extensions tsx 
```

`relay-compiler` is designed for Javascript sources, but work somewhat well on TS sources as well.
If it doesn't work for some reason, extract your query into a separate, smaller source file.

### Start fusebox

``` 
node fuse.js
```

Or whatever way you boot your project.

### Done!

You can now use Relay Modern with Typescript!

## Example

```js 
const query = graphql`
query WelcomeScreenQuery {
  pokemon(name: "Pikachu") {
    name
    weight {
      minimum
      maximum
    }
  }
}  
`;

export class WelcomeScreen extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={query}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            return <WelcomePane />;
          }
          return <div>Loading</div>;
        }}
      />
    );
  }
}
```

This code is placed in:
```
src/WelcomeScreen.tsx
```

When running the compiler, you will get this:
``` 
src/__generated__/WelcomeScreenQuery.graphql.js
```

The transformer will compile
 
```
const query = graphql...
```
 
into
 
```
const query = function () { return require('./__generated__/WelcomeScreenQuery.graphql.js')`.
```

Remember to name your query according to constraints.

# Troubleshooting

It's not working?
First, make sure that `relay-compiler` has created the graphql-files.

They should be placed along side your source files in a folder name `__generated__/`.

```
graphql: Unexpected invocation at runtime. Either the Babel transform was not set up, or it failed to identify this call site.
```

If you get this error, then the transformer is missing.
Make sure you have added it correctly to your config used by the Typescript compiler.