import { createRoutesStub } from "react-router";
import type { Meta, StoryObj } from "@storybook/react";
import Card from ".";

const meta: Meta<typeof Card> = {
  component: Card,
  decorators: [
    (Story) => {
      const Stub = createRoutesStub([
        {
          path: "/",
          Component: Story,
        },
      ]);

      return (
        <div className="max-w-[327px]">
          <Stub />
        </div>
      );
    },
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "過言では？",
    description:
      "確かにいい感じだが、完全に習得するのに学習コストがかかるので、すべてのアプリに適応するのは難しいかも",
    user: {
      displayID: "",
      displayName: "山田太郎マン",
      iconURL: "",
    },
    opinionStatus: "disagree",
  },
};
