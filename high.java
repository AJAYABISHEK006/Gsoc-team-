
import java.util.Scanner;

public class high {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Data types and user input
        int num1, num2;

        System.out.print("Enter first number: ");
        num1 = sc.nextInt();

        System.out.print("Enter second number: ");
        num2 = sc.nextInt();

        // Operators
        System.out.println("\nArithmetic Operations:");
        System.out.println("Addition = " + (num1 + num2));
        System.out.println("Subtraction = " + (num1 - num2));
        System.out.println("Multiplication = " + (num1 * num2));

        if (num2 != 0) {
            System.out.println("Division = " + ((double) num1 / num2));
        } else {
            System.out.println("Division is not possible by zero.");
        }

        // Control statement
        if (num1 > num2) {
            System.out.println("First number is greater.");
        } else if (num2 > num1) {
            System.out.println("Second number is greater.");
        } else {
            System.out.println("Both numbers are equal.");
        }

        sc.close();
    }
}
