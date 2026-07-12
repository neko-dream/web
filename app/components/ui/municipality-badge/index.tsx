type Props = {
  name: string;
};

const MunicipalityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
  >
    <path
      fill="#e8590c"
      d="M9 1.5L2.25 5.25V7.5h1.5v7.5H6v-4.5h3v4.5h2.25V7.5h1.5V5.25L9 1.5zM7.5 15H4.5v-4.5h3V15zm6 0h-3v-4.5h3V15z"
    />
  </svg>
);

export const MunicipalityBadge = ({ name }: Props) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-[#fff4e6] px-1 py-1">
      <MunicipalityIcon />
      <span className="whitespace-nowrap text-[#e8590c] text-[14px] leading-[1.55]">
        {name}
      </span>
    </div>
  );
};
