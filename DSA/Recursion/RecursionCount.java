class RecursionCount
{
    static void countDown(int n)
    {
        if(n == 0)
        {
            return;
        }

        System.out.println(n);
        countDown(n-1);
    }

    public static void main(String[] args)
    {
        countDown(5);
    }
}