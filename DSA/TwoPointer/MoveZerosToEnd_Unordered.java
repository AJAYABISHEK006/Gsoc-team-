class  MoveZerosToEnd_Unordered
{
    public static void main(String[] args)
    {
        int[] arr = {0, 1, 0, 3, 12};
        int left = 0;
        int right = arr.length - 1;

        while(left < right)
        {
            if(arr[left] == 0)
            {
                int temp = arr[left];
                arr[left] = arr[right];
                arr[right] = temp;

                right--;
            }
            left++;
        }
        for(int i : arr)
        {
            System.out.print(i + " ");
        }
    }
}