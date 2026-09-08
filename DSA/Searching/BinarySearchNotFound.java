class BinarySearchNotFound
{
    public static void main(String[] args)
    {
        int[] arr = {10, 20, 30, 40, 50, 60, 70};
        int target = 35;

        int left = 0;
        int right = arr.length - 1;
        int index = -1;

        while(left <= right)
        {
            int mid = (left + right) / 2;

            if(arr[mid] == target)
            {
                index = mid;
                break;
            }
            else if(arr[mid] > target)
            {
                right = mid - 1;
            }
            else
            {
                left = mid + 1;
            }
        }

        if(index != -1)
        {
            System.out.print("Element Found at index : " + index);
        }
        else
        {
            System.out.print("Element Not Found");
        }
    }
}