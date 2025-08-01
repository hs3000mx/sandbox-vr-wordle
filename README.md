This is a project based on wordle implementing tasks 1, 2 and 3
## Getting Started

Node Version used:
v22.13.1

First install necessary npm packages:
```bash
npm install
```

Then, run the development server:
```bash
npm run dev
```

## How to change the word list and maximum guess count
Change the MAX_GUESSES and WORD_LIST values in [config.ts](src/app/api/config.ts)

## Coding Considerations
### [page.tsx](https://github.com/hs3000mx/sandbox-vr-wordle/blob/master/src/app/page.tsx)
There are two backend API calls made there. Since the functionality is relatively self contained within the same page, I have left the API calling code in the same file. If more functionality was required or the API was more fragmented, it would be better more maintainable to refactor them into another file.

### [inputRow.tsx](src/app/components/inputRow.tsx) and [row.tsx](src/app/components/row.tsx)
These two .tsx components share similar CSS styling, it would be possible to refactor their .module.css into a singular file. However, considering the possible expansion of each feature, I thought it would be best to separate them despite some redundant code. A shared .css file could also work if the amount of redundant code is too large.

### [absurd_solver.ts](src/app/api/lib/absurd_solver.ts)
I filter for least number of hits, and then to least number of present. Finally, I just choose the first item in the array if there is more than one group left; by doing so, it should always have only one suitable group/feedback pattern that is returned to the user.

However, this leaves the algorithm to be undeterministic, which could be an area to improve upon given more time.