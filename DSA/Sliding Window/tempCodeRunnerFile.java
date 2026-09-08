class LinearSearch
{
    public static void main(String[] args)
    {
        int[] arr = {5, 10, 15, 20, 25, 30};
        int target = 20;
        index = -1;

        for(int i = 0; i < arr.length; i++)
        {
            if(arr[i] == target)
            {
                index = i;
                break;
            }
        }

        if(index != -1)
        {
            System.out.print("Element Found at Index : " + index);
        }
        else
        {
            System.out.print("Element Not Found");
        }
    }
}