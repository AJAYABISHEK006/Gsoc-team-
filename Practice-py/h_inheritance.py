#hierarchial inheritance
class dad():
     def money(self):
         print("dad has money")
class son1(dad):
     pass
class son2(dad):
     pass
class son3(dad):    
     pass
s2=son2()
s2.money()