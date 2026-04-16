import { UserHeaderProps } from "./utils/UserHeader.types";

export default function UserHeader({ name }: UserHeaderProps) {
  return (
    <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
      <div className="mb-4 md:mb-6 flex h-[72px] w-[72px] md:h-[88px] md:w-[88px] items-center justify-center rounded-full bg-[#E8EBED] text-[28px] md:text-[34px] font-bold text-[#0A2540] shadow-sm">
        {name.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-[22px] md:text-[26px] font-bold text-[#0A2540] mb-2 md:mb-3">{name}</h1>
      <p className="text-[15px] md:text-[17px] text-[#556A7F] max-w-[500px]">
        Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.
      </p>
    </div>
  );
}