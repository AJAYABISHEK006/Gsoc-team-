
class Shape {

    double area() {
        return 0;
    }
}

// Base class
class InheritAnimal {

    void eat() {
        System.out.println("Animal eats");
    }
}

// Single Inheritance
class InheritDog extends InheritAnimal {

    void bark() {
        System.out.println("Dog barks");
    }
}

// Multilevel Inheritance
class Puppy extends InheritDog {

    void play() {
        System.out.println("Puppy plays");
    }
}

// Hierarchical Inheritance
class InheritCat extends InheritAnimal {

    void meow() {
        System.out.println("Cat meows");
    }
}

// Abstract class implementation
class Circle extends Shape {

    double radius = 5;

    @Override
    double area() {
        return 3.14 * radius * radius;
    }
}

public class InheritanceDemo {

    public static void main(String[] args) {

        // Single inheritance
        InheritDog d = new InheritDog();
        d.eat();
        d.bark();

        // Multilevel inheritance
        Puppy p = new Puppy();
        p.eat();
        p.bark();
        p.play();

        // Hierarchical inheritance
        InheritCat c = new InheritCat();
        c.eat();
        c.meow();

        // Abstract class
        Circle circle = new Circle();
        System.out.println("Area of Circle = " + circle.area());
    }
}
