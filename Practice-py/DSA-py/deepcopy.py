import copy

original = [1, 2, [3, 4, 5]]
deep_copied = copy.deepcopy(original)

deep_copied[2].append(6)     # modify the nested list in the copy
deep_copied[0] = 100         # modify a top-level element

print("Original :", original)       # [1, 2, [3, 4, 5]]   -> unaffected
print("Deep copy :", deep_copied)   # [100, 2, [3, 4, 5, 6]]