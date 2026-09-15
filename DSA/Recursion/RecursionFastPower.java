class RecursionFastPower
{
    static int power(int base, int exponent)
    {
        if(exponent == 0)
        {
            return 1;
        }

        int half = power(base, exponent / 2);

        if(exponent % 2 == 0)
        {     
            return half * half;
        }

        return base * half * half;
    }

    public static void main(String[] args)
    {
        System.out.print(power(2,10));
    }
}