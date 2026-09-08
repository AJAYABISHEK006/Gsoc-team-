class OptimizedBubbleSort
{
    public static void main(String[] args)
    {
        int[] arr = {1, 2, 3, 4, 5};

        for(int i = 0; i < arr.length - 1; i++)
        {
            boolean swapped = false;

            for(int j = 0; j < arr.length - 1 - i; j++)
            {
                if(arr[j] > arr[j + 1])
                {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;

                    swapped = true;
                }
            }

            if(!swapped)
            {
                break;
            }
        }
    }
}