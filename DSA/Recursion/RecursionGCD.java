class RecursionGCD
{
    static int GCD(int a,int b)
    {
        if(b == 0)
        {
            return a;
        }
        
        
        return GCD(b,a%b);
    }
    public static void main(String[] args)
    {
        System.out.print("GCD of 48 and 18 is " + GCD(48,18));
    }
}
