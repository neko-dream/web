import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./index.ts";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://avatars.githubusercontent.com/u/135724197?s=96&v=4",
  },
};

export const UnSet: Story = {
  args: {
    src: "",
  },
};
