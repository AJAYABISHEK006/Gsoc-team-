class LinearSearchBoolean
{
    public static void main(String[] args)
    {
        int[] arr = {5, 10, 15, 20, 25, 30};
        int target = 20;
        boolean booleanFound = false;

        for(int i = 0; i < arr.length; i++)
        {
            if(arr[i] == target)
            {
                booleanFound = true;
                break;
            }
        }

        if(booleanFound)
        {
            System.out.print("Element Found ");
        }
        else
        {
            System.out.print("Element Not Found");
        }
    }
}