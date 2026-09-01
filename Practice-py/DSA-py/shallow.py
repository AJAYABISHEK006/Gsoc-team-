import copy

original = {'a': 1, 'b': [10, 20, 30]}
shallow = copy.copy(original)

shallow['b'].append(40)     # mutates the SHARED nested list
shallow['a'] = 999          # rebinds top-level key (does NOT affect original)

print("Original:", original)   # {'a': 1, 'b': [10, 20, 30, 40]}
print("Shallow :", shallow)    # {'a': 999, 'b': [10, 20, 30, 40]}