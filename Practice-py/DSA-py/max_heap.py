import heapq

heap = []

n = int(input("Enter number of elements: "))

for i in range(n):
    value = int(input(f"Enter value {i + 1}: "))
    heapq.heappush(heap, -value)

print("\nMax Heap:", [-x for x in heap])

print("Maximum element:", -heap[0])

removed = -heapq.heappop(heap)
print("Deleted maximum element:", removed)

print("Max Heap after deletion:", [-x for x in heap])