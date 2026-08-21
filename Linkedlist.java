class node{
    int data;
    node next;

    node(int data){
        this.data = data;
        this.next = null;
    }
}

class Linkedlist{
    node head =null;

    void insertatbeg(int data){
        node newnode = new node(data);
        newnode.next = head;
        head = newnode;
    }
    

    void display(){
        node temp = head;
        while(temp != null)
        {
            System.out.print(temp.data+"->");
            temp = temp.next;
        }
        System.out.print("NUll");
    }

    public static void main(String [] args)
    {
        Linkedlist list = new Linkedlist();
        list.insertatbeg(10);
        list.insertatbeg(20);
        list.insertatbeg(30);
        list.display();
    }

}