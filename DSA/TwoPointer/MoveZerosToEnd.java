class  MoveZerosToEnd
{
    public static void main(String[] args)
    {
        int[] arr = {0, 1, 0, 3, 12};
        int left = 0;
        int right = 0;

        while(right < arr.length)
        {
            if(arr[right] != 0)
            {
                int temp = arr[left];
                arr[left] = arr[right];
                arr[right] = temp;
                
                left++;
            }
            right++;
        }
        for(int i : arr)
        {
            System.out.print(i + " ");
        }
    }
}