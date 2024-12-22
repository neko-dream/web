import { createRoutesStub } from "react-router";
import type { Meta, StoryObj } from "@storybook/react";
import Tabs from ".";

const meta: Meta<typeof Tabs> = {
  title: "components/Tabs",
  component: Tabs,
  decorators: [
    (Story) => {
      const Stub = createRoutesStub([
        {
          path: "/",
          Component: Story,
        },
      ]);
      return <Stub />;
    },
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Optional: Story = {
  args: {
    items: [
      { label: "開催中", href: "./" },
      { label: "終了", href: "./?q=finish" },
    ],
  },
};
