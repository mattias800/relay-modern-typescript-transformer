import {parse} from 'graphql/language';
import * as ts from 'typescript';

// Internal flag that signifies if the node contains any ES2015 nodes. We need this to quicker find
// tagged template expressions and avoid descending into Typescript nodes since visitEachChild breaks.
const ContainsES2015 = 1 << 7;

export function transformer(context): ts.Transformer<ts.SourceFile> {
  let sourcePath: string;

  return node => {
    sourcePath = node.fileName;
    const result = ts.updateSourceFileNode(
        node, ts.visitLexicalEnvironment(node.statements, visitor, context));
    sourcePath = undefined;
    return result;
  };

  function visitor(node: ts.Node): ts.Node {
    if (node['transformFlags'] & ContainsES2015) {
      if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
        return visitTaggedTemplateExpression(
            <ts.TaggedTemplateExpression>node);
      } else {
        return ts.visitEachChild(node, visitor, context);
      }
    } else {
      return node;
    }
  }

  function visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): ts.Node {
    if (node.tag.getText() === 'graphql') {
      const graphQlNode = parse((<{text:string}>node.template).text);
      const queryName = getQueryName(graphQlNode);

      const path = `./__generated__/${queryName}.graphql.js`;

      const requireNode = ts.createCall(
          ts.createIdentifier('require'),
          [],
          [ts.createLiteral(path)],
      );

      return ts.createArrowFunction(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          requireNode,
      );
    }
    return node;
  }
}

const getQueryName = (graphQlNode: any): string => {
  return graphQlNode.definitions[0].name.value;
};