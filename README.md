# relay-modern-typescript-transformer
A Typescript transformer that transforms GraphQL queries to require functions.

This is loosely based on `typescript-relay-plugin`, which works with Relay Classic, but not Relay Modern.
https://github.com/Pathgather/typescript-relay-plugin

# Tutorial

### Install with Yarn (or NPM)

```bash
$ yarn add relay-modern-typescript-transformer
$ yarn add relay-compiler
```

`relay-compiler` is used to compile the queries into optimized .graphql files.

Read the Relay Modern docs for more info.

### Add transform to Typescript config

#### fuse-box

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

#### webpack

For `webpack`, see the manual for the Typescript loader you are using.

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
import * as React from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import { environment } from './config/relay/RelayEnvironmentFactory';
import { Pokemon } from './typings/types';

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
        render={({ error, props }: { error: any, props: { pokemon: Pokemon } }) => {
          if (error) {
            return <div>{error.message}</div>;
          } else if (props) {
            const { pokemon } = props;
            return <div>{pokemon.name} - {pokemon.weight && pokemon.weight.minimum}
              - {pokemon.weight && pokemon.weight.minimum}</div>;
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

# Typings

If you want Typescript types for the GraphQL types, you can use this tool.
https://github.com/dotansimha/graphql-code-generator

``` 
$ yarn add -D graphql-code-generator 
```

``` 
$ gql-gen --file src/data/schema.json --template typescript --out ./src/typings/ ./src/**/*.ts
```

# Troubleshooting

It's not working?
First, make sure that `relay-compiler` has created the graphql-files.

They should be placed along side your source files in a folder name `__generated__/`.

```
graphql: Unexpected invocation at runtime. Either the Babel transform was not set up, or it failed to identify this call site.
```

If you get this error, then the transformer is missing.
Make sure you have added it correctly to your config used by the Typescript compiler.