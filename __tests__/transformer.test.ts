import {compile} from './support/compile';
import * as path from 'path';

describe('transformer', () => {

  it('should work', () => {

    const file = path.join(__dirname, 'support/testcode.ts');
    compile([file]);

  });
});
