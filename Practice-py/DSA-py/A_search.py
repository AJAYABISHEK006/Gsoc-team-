import heapq

# Get number of nodes
n = int(input("Enter number of nodes: "))

graph = {}

# Get edges
for i in range(n):
    graph[i] = []

edges = int(input("Enter number of edges: "))

for i in range(edges):
    u = int(input("Enter source node: "))
    v = int(input("Enter destination node: "))
    cost = int(input("Enter cost: "))

    graph[u].append((v, cost))
    graph[v].append((u, cost))


# Get heuristic values
heuristic = {}

print("\nEnter heuristic values:")

for i in range(n):
    heuristic[i] = int(input(f"Heuristic of node {i}: "))


start = int(input("\nEnter start node: "))
goal = int(input("Enter goal node: "))


# A* Search
open_list = []
heapq.heappush(open_list, (heuristic[start], 0, start))

g_cost = {start: 0}
parent = {start: None}

visited = set()

while open_list:
    f, g, current = heapq.heappop(open_list)

    if current in visited:
        continue

    visited.add(current)

    if current == goal:
        break

    for neighbor, cost in graph[current]:
        new_g = g + cost

        if neighbor not in g_cost or new_g < g_cost[neighbor]:
            g_cost[neighbor] = new_g
            f_cost = new_g + heuristic[neighbor]

            parent[neighbor] = current

            heapq.heappush(
                open_list,
                (f_cost, new_g, neighbor)
            )


# Display path
if goal not in parent:
    print("No path found.")

else:
    path = []
    current = goal

    while current is not None:
        path.append(current)
        current = parent[current]

    path.reverse()

    print("\nShortest path:", " -> ".join(map(str, path)))
    print("Total cost:", g_cost[goal])