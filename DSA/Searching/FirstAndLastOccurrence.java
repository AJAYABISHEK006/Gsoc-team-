class FirstAndLastOccurrence
{
    static int firstOccurrence(int[] arr, int target)
    {
        int left = 0;
        int right = arr.length - 1;
        int index = -1;

        while(left <= right)
        {   
            int mid = (left + right) / 2;

            if(arr[mid] == target)
            {
                index = mid;
                right = mid - 1;
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
        
        return index;
    }

    static int lastOccurrence(int[] arr, int target)
    {
        int left = 0;
        int right = arr.length - 1;
        int index = -1;

        while(left <= right)
        {
            int mid = (left + right) / 2;

            if(arr[mid] == target)
            {
                index = mid;
                left = mid + 1;
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

        return index;
    }

    public static void main(String[] args)
    {
        int[] arr = {10, 20, 20, 20, 30, 40};
        int target = 20;

        int fIndex = firstOccurrence(arr, target);
        int lIndex = lastOccurrence(arr, target);

        System.out.println("First Occurrence : " + fIndex);
        System.out.println("Last Occurrence : " + lIndex);

    }
}