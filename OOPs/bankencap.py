class BankAccount:
    def __init__(self, name, balance):
        self.name = name
        self.__balance = balance  

    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print("Amount deposited successfully")

    def withdraw(self, amount):
        if amount > 0 and amount <= self.__balance:
            self.__balance -= amount
            print("Amount withdrawn successfully")
        else:
            print("Insufficient balance")

    def get_balance(self):
        return self.__balance


account = BankAccount("Dharshni", 5000)

print("Account Holder:", account.name)
print("Initial Balance:", account.get_balance())

account.deposit(2000)
print("Balance after deposit:", account.get_balance())

account.withdraw(1500)
print("Balance after withdrawal:", account.get_balance())