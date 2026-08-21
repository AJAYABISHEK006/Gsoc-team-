#include <stdio.h>
#define MAX 100
int arr[MAX];
int n=0;
void insert (){
    int value ,pos,i;
    printf("Ent Invalid position \n");
    return;
}
printf("Enter the value:");
scanf("%d",&value);
for(i=n;i>=pos;i--){
    arr[i]=arr[i-1];
}
arr[pos-i]=value;
n++;
printf("Element inserted succesfully\n ");                                                                                                                                                                                                      