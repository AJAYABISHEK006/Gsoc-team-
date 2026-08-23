from collections import deque

queue = deque()

queue.append(10)
queue.append(20)
queue.append(30)

print(queue)

first = queue.popleft()

print(first)
print(queue)