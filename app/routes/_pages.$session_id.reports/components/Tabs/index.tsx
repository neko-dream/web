type Tab = {
  label: string;
  value: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
};

export const Tabs = ({ tabs, activeTab, onChange }: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl items-center justify-center space-x-4 rounded-full bg-white">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative flex-1 cursor-pointer rounded-full px-4 py-3 font-bold text-sm ${
            activeTab === tab.value
              ? "border-gradient before:rounded-[50px]"
              : "text-[#C7C7CC]"
          }`}
        >
          <span
            className={
              activeTab === tab.value ? "primary-gradient text-clip " : ""
            }
          >
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
