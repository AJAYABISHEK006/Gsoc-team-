class PairWithTargetSum
{
    public static void main(String[] args)
    {
        int[] arr = {1, 2, 3, 4, 6, 8};
        int target = 10;

        int left = 0;
        int right = arr.length - 1;

        boolean found = false;

        while(left < right)
        {
            int sum = arr[left] + arr[right];

            if(sum == target)
            {
                System.out.print("Match found : "
                        + arr[left] + " + " + arr[right]);

                found = true;
                break;
            }
            else if(sum < target)
            {
                left++;
            }
            else
            {
                right--;
            }
        }

        if(!found)
        {
            System.out.print("Match not found");
        }
    }
}