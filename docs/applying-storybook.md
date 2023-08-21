# Applying Storybook to Components and Pages

## Overview

StorybookJS is a UI tool for isolating UI components to visually test their styles and states.

This is great for checking the various iterations of a component in a sandbox versus scouring all the pages in a large scale project it is used to verify that the component is rendering properly.

You can also render pages if you need that level of visual testing.

Storybook also gives you a library of addons provided by the team and the community to enhance the testing, including UX testing, A11y compliance, etc.

Check out [Intro to Storybook](https://storybook.js.org/tutorials/intro-to-storybook/) to get an in-depth look on the workflow.

## Spinning up the Storybook server

It's as easy as running `yarn storybook` to boot up a dedicated localhost to see all the components that have stories.

## Setting up a component's stories

> 🚨 NOTE: This project has version 7, which is currently still in beta. The following documentation outlines preferences in setup as it relates to this version. You can refer to the [7.0 beta docs](https://storybook.js.org/docs/7.0/react/) if you need any additional details

A Storybook "story" is an instance of a component in a certain state or with certain parameters applied to show an alternative version of the component.

Each component will only need one file containing all the stories.

The stories file will reside with each component. So the base folder structure in `src` will look like this:

```
src/
└── components/
    └── ComponentA/
        ├── index.tsx
        ├── ComponentA.stories.tsx
        └── // Any other files as applicable (utils, child components, useHook, etc.)
```

The initial structure of each story file will look something like this (in typescript):

```tsx
import ComponentA from "."

type ComponentAType = typeof ComponentA

const meta: Meta<ComponentAType> {
  title: "ComponentA",
  component: ComponentA
}

export default meta
type Story = StoryObj<ComponentAType>;

export const Basic: Story = {
  render: () => <ComponentA />
}
```

**Note**: with the `title` option, we write this based on the groupings set by the Design System. Groupings are declared with forward slashes. (i.e. `Atoms / Form / Input`). See the Storybook docs for details on [Naming conventions](https://storybook.js.org/docs/7.0/react/writing-stories/naming-components-and-hierarchy)

We will maintain this structure for every story file, regardless of simplicity.

Should the component accept props on all or some renders, you can provide an `args` prop for each story and supply the necessary data. And if there is children, use the `render` prop to pass the args and supply children elements.

Let's say for a `Button` component with different style variants...

```tsx
import Button from "."

type ButtonType = typeof Button

const meta: Meta<ButtonType> {
  title: "Button",
  component: Button
}

export default meta
type Story = StoryObj<ButtonType>;

export const Solid: Story = {
  render: (args) => <Button {...args}>A Button</Button>,
  args: {
    variant: 'solid',
  }
}
export const Outline: Story = {
  render: (args) => <Button {...args}>A Button</Button>,
  args: {
    variant: 'outline',
  }
}

/**
 * For practical purposes, if you are displaying different "variants",
 * they should be shown under one story, so they can be seen side-by-side in the GUI
 * for reviewers to easily compare.
 * This can also be done for various sizes or other like alterations
 */

// Assuming `solid` is the default variant in the Chakra theme config
export const Variants = () => (
  <VStack>
    <Button>A Solid Button</Button>
    <Button variant="outline">An Outline Button</Button>
    <Button variant="unstyled">An Unstyled Button</Button>
  </VStack>
)
```

If only one story is provided for a component, the name of the exported object should match the name in the `title` meta option. (If the title is `Atoms / Form / Button` then the object should be named `Button`) This will hoist the display name up to the parent level in the Storybook dashboard's sidebar.

As you go and make adjustments to the component itself or it's variant styles, Storybook will hot reload and those changes will appear in the stories that emphasize them.

## Storybook Dashboard

The dashboard where you view each story has a number of different addons available to check the story thoroughly.

Outlined below are each area going from left to right in the selections.

| Sidebar above the preview                | Dashboard below the preview                                                                                                                                                                                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Rerender preview                      | 1. Controls - allows you to interact with a component’s args (inputs) dynamically. Experiment with alternate configurations of the component to discover edge cases. See [Controls addon docs](https://storybook.js.org/docs/7.0/react/essentials/controls)                |
| 2. Zoom In                               | 2. Actions (if applicable) - help you verify interactions produce the correct outputs via callbacks. See [Actions addon docs](https://storybook.js.org/docs/7.0/react/essentials/actions)                                                                                  |
| 3. Zoom Out                              | 3. Interactions (if applicable) - In conjunction with the `play` function in a story object, this section allows you to simulate user interactions after the story renders. See [Interactions addon docs](https://storybook.js.org/docs/7.0/react/essentials/interactions) |
| 4. Reset Zoom                            | 4. Accessibility provides visual A11y results for each story.<br><br>**NOTE**: To check accessibility for light and dark mode, you will need to toggle the mode, then rerender the preview to update the results.                                                          |
| 5. Change background                     |
| 6. Apply grid to preview                 |
| 7. Change viewport size                  |
| 8. Enable measuring of elements on hover |
| 9. Apply element outlines to preview     |
| 10. A11y Visualization Simulator         |
| 11. Set layout direction (left or right) |
| 12. Toggle color mode                    |
