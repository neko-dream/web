/* eslint-disable import/no-unresolved */
import type { Meta, StoryObj } from "@storybook/react";
import prefectures from "~/assets/data/adress/prefectures.json";
import birthday from "~/assets/data/birthday.json";
import gender from "~/assets/data/gender.json";
import occupation from "~/assets/data/occupation.json";
import Select from ".";

const meta: Meta<typeof Select> = {
  component: Select,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: true,
    options: [...new Array(30)].map((_, i) => ({
      value: `${i}`,
      title: `${i}個目の北海道!!`,
    })),
  },
};

export const Prefectures: Story = {
  args: {
    options: prefectures.map((v) => ({ value: `${v}`, title: `${v}` })),
  },
};

export const Birthday: Story = {
  args: {
    options: birthday.map((v) => ({ value: `${v}`, title: `${v}` })),
  },
};

export const Gender: Story = {
  args: {
    options: gender.map((v) => ({ value: v, title: v })),
  },
};

export const Occupation: Story = {
  args: {
    options: occupation.map((v) => ({ value: v, title: v })),
  },
};
