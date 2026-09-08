class SumOfElementGreaterThan25
{
    public static void main(String[] args)
    {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;

        for(int i : arr)
        {
            if(i > 25)
            {
                sum += i;
            }
        }
        System.out.println("Sum of elements Greater than 25 : " + sum);
    }
}
