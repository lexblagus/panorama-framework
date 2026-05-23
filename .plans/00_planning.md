# Tasks

- Image generation model ChatGPT 2 (and 4K images)
- Continue work on panorama framework
  - Update framework docs for Robot: mostly Operational pipeline
  - Plan next layer? The one that will seam the gaps between tiles (tiles 1-8 as piramid)
- Create a compile-prompts recipe
  - Requred in Robot: implement "openai.respond" service
- ~~Log from Stepjan (class)~~
- ~~Log in builder, runner and services~~
- ~~Full code review on Robot~~
  - ~~builder, runner and services~~
  - ~~generate-panorama recipe~~
- ~~Rotate branches (feature/monorepo to main)~~

# Claude Code tasks

- ~~In robot/recipes/examples/workflow/run-recipe-empty.ts (and any other recipe), the steps[].arguments.mode (actually Step.arguments) is typed as string. Can we proper type it `'build'|'exec'|'run'|'resume'`(if this is the proper type) ?~~

- ~~Based on examples, implement an E2E test suite. Does examples cover all the features?~~

- ~~Make JSDoc for functions and classes. Try to jsdoc them all, you can exclude the ones that does not make sense or is too obvious.~~

- ~~Review all READMEs and propose improvments~~
