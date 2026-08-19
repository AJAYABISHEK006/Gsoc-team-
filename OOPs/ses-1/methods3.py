class Calculator:
    def __init__(self, a, b):
        self.a = a
        self.b = b

    def add(self):
        print("Addition:", self.a + self.b)

    def subtract(self):
        print("Subtraction:", self.a - self.b)

    def multiply(self):
        print("Multiplication:", self.a * self.b)

    def divide(self):
        print("Division:", self.a / self.b)


calc = Calculator(20, 5)

calc.add()
calc.subtract()
calc.multiply()
calc.divide()