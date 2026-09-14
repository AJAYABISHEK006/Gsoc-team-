public class Student {

    String name;
    int age;
    String course;

    static String collegeName = "KGiSL Institute of Technology";

    Student() {
        name = "Unknown";
        age = 0;
        course = "Not Assigned";
    }

    Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }

    void displayDetails() {
        System.out.println("Name   : " + name);
        System.out.println("Age    : " + age);
        System.out.println("Course : " + course);
    }

    static void displayCollege() {
        System.out.println("College: " + collegeName);
    }

    public static void main(String[] args) {

        Student s1 = new Student();

        Student s2 = new Student("Dhanashankar", 19, "AIML");

        System.out.println("Student 1 Details:");
        s1.displayDetails();

        System.out.println("\nStudent 2 Details:");
        s2.displayDetails();

        System.out.println();
        Student.displayCollege();
    }
}

