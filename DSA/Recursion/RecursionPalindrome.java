class RecursionPalindrome
{
    static String palindrome(int n)
    {

        if(reverse(n,0) == n)
        {
            return "Paindrome";
        }   
        else{
            return "Not A Palindrome";
        }
    }

    static int reverse(int n, int rev)
    {
        if(n == 0){
            return rev;
        }
        rev = rev*10 + n%10;
        return reverse(n/10,rev); 
    }

    public static void main(String[] args)
    {
        int n = 121;
        System.out.print(palindrome(n));
    }
}