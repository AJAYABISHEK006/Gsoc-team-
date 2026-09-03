balance_A = 1000
balance_B = 500

try:
    old_A = balance_A
    old_B = balance_B

    balance_A -= 200

    
    raise Exception("Transaction error")

    balance_B += 200

except:
   
    balance_A = old_A
    balance_B = old_B
    print("Transaction failed - Rolled back")

print("Account A:", balance_A)
print("Account B:", balance_B)