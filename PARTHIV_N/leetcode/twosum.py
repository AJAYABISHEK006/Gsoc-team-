def two_sum(n, t):
    seen = {}

    for i, num in enumerate(n):
        c = t - num

        if c in seen:
            return [seen[c], i]

        seen[num] = i

    return []


n = [2, 7, 11, 15]
t = 9

result = two_sum(n, t)

print("Numbers:", n)
print("Target:", t )
print("Indices:", result)