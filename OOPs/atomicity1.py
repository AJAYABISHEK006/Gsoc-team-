balance_A = 1000
balance_B = 500

try:

    balance_A -= 200

    balance_B += 200

    print("Transaction successful")

except:
    print("Transaction failed")

print("Account A:", balance_A)
print("Account B:", balance_B)