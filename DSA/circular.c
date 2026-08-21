#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node *head = NULL;

// Insert at beginning
void insertBeginning(int value) {
    struct Node *newNode, *temp;

    newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = value;

    if (head == NULL) {
        head = newNode;
        newNode->next = head;
        return;
    }

    temp = head;

    while (temp->next != head) {
        temp = temp->next;
    }

    newNode->next = head;
    temp->next = newNode;
    head = newNode;
}

// Insert at end
void insertEnd(int value) {
    struct Node *newNode, *temp;

    newNode = (struct Node *)malloc(sizeof(struct Node));
    newNode->data = value;

    if (head == NULL) {
        head = newNode;
        newNode->next = head;
        return;
    }

    temp = head;

    while (temp->next != head) {
        temp = temp->next;
    }

    temp->next = newNode;
    newNode->next = head;
}

// Delete from beginning
void deleteBeginning() {
    struct Node *temp, *last;

    if (head == NULL) {
        printf("List is empty\n");
        return;
    }

    // Only one node
    if (head->next == head) {
        free(head);
        head = NULL;
        return;
    }

    last = head;

    while (last->next != head) {
        last = last->next;
    }

    temp = head;
    head = head->next;
    last->next = head;

    free(temp);
}

// Delete from end
void deleteEnd() {
    struct Node *temp, *prev;

    if (head == NULL) {
        printf("List is empty\n");
        return;
    }

    // Only one node
    if (head->next == head) {
        free(head);
        head = NULL;
        return;
    }

    temp = head;

    while (temp->next != head) {
        prev = temp;
        temp = temp->next;
    }

    prev->next = head;
    free(temp);
}

// Display
void display() {
    struct Node *temp;

    if (head == NULL) {
        printf("List is empty\n");
        return;
    }

    temp = head;

    do {
        printf("%d -> ", temp->data);
        temp = temp->next;
    } while (temp != head);

    printf("(head)\n");
}

int main() {

    insertBeginning(30);
    insertBeginning(20);
    insertBeginning(10);

    printf("After insertion at beginning:\n");
    display();

    insertEnd(40);
    insertEnd(50);

    printf("\nAfter insertion at end:\n");
    display();

    deleteBeginning();

    printf("\nAfter deletion from beginning:\n");
    display();

    deleteEnd();

    printf("\nAfter deletion from end:\n");
    display();

    return 0;
}