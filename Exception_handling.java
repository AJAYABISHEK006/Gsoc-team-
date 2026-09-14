class AgeException extends Exception {
    AgeException(String message) {
        super(message);
    }
}

public class Exception_handling{
    public static void main(String[] args) {

        // Built-in exception
        try {
            int a = 10;
            int b = 0;
            int result = a / b;

            System.out.println("Result = " + result);
        } 
        catch (ArithmeticException e) {
            System.out.println("Built-in Exception: Cannot divide by zero");
        }

        // User-defined exception
        try {
            int age = 15;

            if (age < 18) {
                throw new AgeException("Age must be 18 or above");
            }

            System.out.println("Eligible for voting");
        } 
        catch (AgeException e) {
            System.out.println("User-defined Exception: " + e.getMessage());
        }
    }
}
