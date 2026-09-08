class SecondLargestEvenElement
{
    public static void main(String[] args)
    {

    int[] arr = {10, 30, 20, 50, 40};

    int max = 0;    // instead of 0 use Integer.MIN_VALUE
    int smax = 0;   // instead of 0 use Integer.MIN_VALUE
    
    for (int i : arr) 
    {
        if(i % 2 == 0)
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
    }
    System.out.println(smax);
    }
}