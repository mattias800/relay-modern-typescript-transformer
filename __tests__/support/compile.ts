import * as ts from 'typescript';
import {transformer} from '../../index';

export function compile(
    filePaths: string[], writeFileCallback?: ts.WriteFileCallback): void {
  const program = ts.createProgram(filePaths, {
    strict: true,
    noEmitOnError: true,
    target: ts.ScriptTarget.ES5,
  });
  const transformers: ts.CustomTransformers = {
    before: [transformer],
    after: [],
  };
  const emitResult = program.emit(
      undefined, undefined, undefined, false, transformers);

  const {emitSkipped, diagnostics} = emitResult;

  if (emitSkipped) {
    throw new Error(
        diagnostics.map(diagnostic =>
            `${diagnostic.file ? diagnostic.file.fileName : 'No file'}
            ${diagnostic.messageText}
            ${diagnostic.source}
            ${diagnostic.code.toString()}
            `
        ).join('\n'));
  }
}
