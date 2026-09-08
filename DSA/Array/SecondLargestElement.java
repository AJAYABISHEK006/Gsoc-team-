class SecondLargestElement
{
    public static void main(String[] args)
    {

    int[] arr = {10, 30, 20, 50, 40};

    int max = arr[0];
    int smax = 0;
    
    for (int i : arr) 
    {
        if (i > max)
        {
            smax = max;
            max = i;
        }
        else if (i > smax)
        {
            smax = i;  
        }
    }
    System.out.println(smax);
    }
}