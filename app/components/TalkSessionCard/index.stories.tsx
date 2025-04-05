import type { Meta, StoryObj } from "@storybook/react";
import { createRoutesStub } from "react-router";
import Session from ".";

const meta: Meta<typeof Session> = {
  component: Session,
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

export const Default: Story = {
  args: {
    talkSession: {
      restrictions: [],
      id: "0000",
      theme: "レッサーパンダかわいい、アイドルにしたい",
      owner: {
        displayID: "西山公園のアイドルレッサーパンダをどうしても推し隊",
        displayName: "西山公園のアイドルレッサーパンダをどうしても推し隊",
        iconURL: "https://avatars.githubusercontent.com/u/135724197?s=96&v=4",
      },
      createdAt: "2024-10-13T21:38:41Z",
      scheduledEndTime: "2024-10-13T21:38:41Z",
      location: {
        latitude: 0,
        longitude: 0,
      },
      prefecture: "福井県",
      city: "鯖江市",
    },
    opinionCount: 100,
  },
};

export const Finished: Story = {
  args: {
    talkSession: {
      restrictions: [],
      id: "0000",
      theme: "レッサーパンダかわいい、アイドルにしたい",
      owner: {
        displayID: "西山公園のアイドルレッサーパンダをどうしても推し隊",
        displayName: "西山公園のアイドルレッサーパンダをどうしても推し隊",
        iconURL: "https://avatars.githubusercontent.com/u/135724197?s=96&v=4",
      },
      createdAt: "2000-10-13T21:38:41Z",
      scheduledEndTime: "2000-10-13T21:38:41Z",
      location: {
        latitude: 0,
        longitude: 0,
      },
      prefecture: "福井県",
      city: "鯖江市",
    },
    opinionCount: 100,
  },
};
