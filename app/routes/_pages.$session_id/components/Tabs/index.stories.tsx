import type { Meta, StoryObj } from "@storybook/react";
import { createRoutesStub } from "react-router";
import { Tabs } from ".";

const meta: Meta<typeof Tabs> = {
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
      { label: "内容", href: "./" },
      { label: "意見", href: "./?q=finish" },
      { label: "レポート", href: "./?q=finish" },
    ],
  },
};
