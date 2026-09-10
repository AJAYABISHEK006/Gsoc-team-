class RecursionDecimalToBinary
{
    static void decimalToBinary(int n)
    {
        if(n == 1)
        {
            System.out.print(1);
            return ;
        }
        decimalToBinary(n/2);
        System.out.print(n%2);
        
    }

    public static void main(String[] args)
    {
        int n = 10;
        decimalToBinary(n);
    }
}