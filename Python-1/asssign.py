# Program to perform arithmetic operations on two numbers

num1 = float(input("Enter the first number: "))
num2 = float(input("Enter the second number: "))

print("\nArithmetic Operations:")
print(f"{num1} + {num2} = {num1 + num2}")
print(f"{num1} - {num2} = {num1 - num2}")
print(f"{num1} * {num2} = {num1 * num2}")

if num2 != 0:
    print(f"{num1} / {num2} = {num1 / num2}")
    print(f"{num1} % {num2} = {num1 % num2}")
    print(f"{num1} // {num2} = {num1 // num2}")
else:
    print("Division, modulus, and floor division cannot be performed (division by zero).")

print(f"{num1} ** {num2} = {num1 ** num2}")
