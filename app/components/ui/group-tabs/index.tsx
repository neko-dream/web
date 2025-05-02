type Tab = {
  label: string;
  value: string;
};

type Props = {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
};

export const GroupTabs = ({ tabs, activeTab, onChange }: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center space-x-4 rounded-md bg-white">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative flex-1 cursor-pointer rounded-md px-4 py-3 font-bold text-sm ${
            activeTab === tab.value
              ? "border-gradient before:rounded-md"
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
