try:
    a=int(input())
    b=int(input())
    c=input()
    #print(d)
except ValueError as e:
    print("ValueError:",e)
except TypeError as e:
    print("TypeError:",e)
except Exception:
    print("Somethings wrong")
finally:
    print("Completed-done")