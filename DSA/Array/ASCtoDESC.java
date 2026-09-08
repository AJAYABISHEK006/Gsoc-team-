class ASCtoDESC
{
    public static void main(String[] args)
    {
        int[] arr = {10, 20, 30, 40, 50};

        int left = 0;
        int right = arr.length - 1;

        while (left < right)
        {

            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;

            left++;
            right--;
        }

        for(int i : arr)
        {
            System.out.print(i + " ");
        }
    }
}