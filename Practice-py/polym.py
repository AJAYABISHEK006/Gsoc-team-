class Animal():
    def sound(self):
        print("Animal makes sound")
class dog(Animal):
    def sound(self):
        print("Dog barks")
class Bird(Animal):
    def sound(self):
        print("Bird sings")
cow=Animal()
dog1=dog()
bird1=Bird()
#method overiding
bird1.sound()