# Kana Dojo – Open Source Contribution

## Project

Kana Dojo is an open-source project related to Japanese language learning.

## Contribution Type

Bug Fix / Input Normalization

## Problem

Vocabulary answers may contain formatting differences such as invisible characters, non-breaking spaces, or Unicode variations. These differences can affect answer comparison.

## My Contribution

I improved the answer normalization logic before comparing vocabulary answers.

The changes include:

- Removing zero-width characters
- Replacing non-breaking spaces with normal spaces
- Applying Unicode normalization using NFC
- Removing unnecessary spaces using trim()
- Converting answers to lowercase

## Technologies Used

- TypeScript
- Git
- GitHub
- Next.js

## Git Workflow

1. Created a separate branch.
2. Modified the vocabulary answer normalization logic.
3. Tested the changes.
4. Committed the changes.
5. Pushed the branch to GitHub.
6. Created a Pull Request.

## Branch

`fix/normalize-vocabulary-answers`

## Commit

`fix: normalize vocabulary answers`

## Evidence

Screenshots of the Pull Request, commit, and changed files are available in the `screenshots` folder.

---

## Learning Outcome

Through this contribution, I learned how to:

- Understand an existing open-source codebase
- Work with TypeScript
- Create and manage Git branches
- Make meaningful code changes
- Commit and push changes
- Create a Pull Request
- Participate in an open-source workflow
