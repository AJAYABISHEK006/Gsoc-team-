class PalindromeInArray
{
    public static void main(String[] args)
    {
        int[] arr = {1, 2, 3, 2, 1};
        int left = 0;
        int right = arr.length - 1;
        String result = "Palindrome";

        while(left < right)
        {
            if(arr[left] != arr[right])
            {
                result =  "Not a Palindrome";
                break;
            }
            left++;
            right--;
        }
        System.out.print(result);
    }
}