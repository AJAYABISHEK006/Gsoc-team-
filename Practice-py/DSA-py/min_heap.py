import heapq

heap = []

n = int(input("Enter number of elements: "))

for i in range(n):
    value = int(input(f"Enter value {i + 1}: "))
    heapq.heappush(heap, value)

print("\nMin Heap:", heap)

print("Minimum element:", heap[0])

removed = heapq.heappop(heap)
print("Deleted minimum element:", removed)

print("Min Heap after deletion:", heap)