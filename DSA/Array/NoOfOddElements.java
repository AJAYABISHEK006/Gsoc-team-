class NoOfOddElements
{
    public static void main(String[] args)
    {
        int[] arr = {10, 15, 20, 25, 30, 35};
        int count  = 0;

        for(int i : arr)
        {
            if(i % 2 != 0)
            {
                count++;
            }
        }
        System.out.println("Number of odd elements : " + count);
    }
}