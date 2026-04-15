import { UserHeaderProps } from "./utils/UserHeader.types";

export default function UserHeader({ name }: UserHeaderProps) {
  return (
    <div className="mb-12 flex flex-col items-center text-center">
      <div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#E8EBED] text-[34px] font-bold text-[#0A2540]">
        {name.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-[26px] font-bold text-[#0A2540] mb-3">{name}</h1>
      <p className="text-[17px] text-[#556A7F]">
        Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.
      </p>
    </div>
  );
}