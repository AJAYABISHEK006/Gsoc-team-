class dad():
    def money(self):
        print("dad has money")
class land():
    def imp(self):
        print("Property is mine")
class son1(dad,land):
    pass
class son2(dad):
    pass
class son3(dad):   
    pass
s1=son1()
s1.money()
s1.imp()