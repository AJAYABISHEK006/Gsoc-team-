#access modifiers(private variables)
class company():
    def __init__(self):
        self.__company_name="Google" #access modifier only accesible inside class not outside
        #self._company_name="Flipcart" #protected variable
    def companyName(self):
        print(self.__company_name)
c1=company()
c1.companyName()
#print(c1.company_name) #this not possible gives error
#Encapsulation-Hiding a variable,access inside function only
#print(c1._company_name)