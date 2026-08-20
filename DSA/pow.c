class Solution {
    public double myPow(double x, int n) {

        long power = n;

        if (power < 0) {
            x = 1 / x;
            power = -power;
        }

        double result = 1.0;

        while (power > 0) {

            if (power % 2 == 1) {
                result = result * x;
            }

            x = x * x;
            power = power / 2;
        }

        return result;
    }
}