def infix_to_postfix(expr):
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    output = []
    stack = []
    for ch in expr:
        if ch.isalnum():
            output.append(ch)
        elif ch == '(':
            stack.append(ch)
        elif ch == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()                       # remove '('
        else:                                  # operator
            while (stack and stack[-1] != '(' and
                   precedence.get(stack[-1], 0) >= precedence.get(ch, 0)):
                output.append(stack.pop())
            stack.append(ch)
    while stack:
        output.append(stack.pop())
    return ''.join(output)

print(infix_to_postfix("((A+B)-C*(D/E))+F"))