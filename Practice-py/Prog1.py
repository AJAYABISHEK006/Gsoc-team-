class laptop():
    chargertype="Type C"
    def __init__(self):
        self.brand=""
        self.price=25000
    def setprice(self,price):
        self.price=price
    def getprice(self):
        print("Price is:",self.price)
    @classmethod
    def setchargertype(cls):
        cls.chargertype="Type B"
        print("Charger type is:",cls.chargertype)
    @staticmethod
    def info():
        print("This is a laptop class")
hp=laptop()
laptop.setchargertype()
hp.info()