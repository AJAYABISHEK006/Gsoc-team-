class Animal {
    static String type = "Animal";
    final String name = "Rocky";

    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {

    void sound() {
        super.sound();
        System.out.println("Bark");
    }

    void show() {
        System.out.println(super.name);
        System.out.println(Animal.type);
    }
}

public class Main {
    public static void main(String[] args) {

        Dog d = new Dog();

        d.sound();
        d.show();

        System.out.println(Animal.type);
    }
}