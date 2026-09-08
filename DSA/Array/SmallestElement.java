class SmallestElement
{
    public static void main(String[] args)
    {
        int[] arr = {5, 2, 8, 1, 9, 3};
        int min = arr[0];

        for(int i : arr)
        {
            if(i < min)
            {
                min = i;
            }
        }
        System.out.print("Smallest element  : " + min);
    }
}