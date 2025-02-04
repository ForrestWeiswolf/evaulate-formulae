import Expression from './Expression';
import NumericExpression from './NumericExpression';
import OperatorExpression from './OperatorExpression';
import tokenize from './tokenize';
import VariableExpression from './VariableExpression';

export const operations = ['^', '*', '/', '+', '-'];

const numericOrVariableExpression = (token: string) => {
  // todo: handle negative numbers
  if (/\d+/.exec(token)) {
    return new NumericExpression(parseFloat(token));
  }

  return new VariableExpression(token);
};

const expressionTreeFromString = (expression: string) => {
  const tokens = tokenize(expression);
  let tree: Expression = numericOrVariableExpression(tokens[0]);

  // Note that this loop starts at 1
  for (let i = 1; i < tokens.length; i++) {
    if (operations.includes(tokens[i])) {
      tree = tree.insert(new OperatorExpression(tokens[i]));
    } else if (tree instanceof OperatorExpression) {
      tree = tree.insert(numericOrVariableExpression(tokens[i]));
    } else {
      tree = tree.insert(new OperatorExpression(tokens[i]));
    }
  }

  return tree;
};

const evaluateExpression = (expression: string, variables: Record<string, number> = {}): number => {
  const tree = expressionTreeFromString(expression);

  return tree.evaluate(variables);
};

export default evaluateExpression;
