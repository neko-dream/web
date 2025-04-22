import type React from "react";
import { useEffect, useRef, useState } from "react";

type PopoverProps = {
  buttonLabel: React.ReactNode;
  children: React.ReactNode;
};

export const Popover = ({ buttonLabel, children }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopover = () => setIsOpen((prev) => !prev);
  const closePopover = () => setIsOpen(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      closePopover();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={togglePopover}
        className="absolute top-4 right-4 cursor-pointer"
      >
        {buttonLabel}
      </button>
      {isOpen && (
        <div className="absolute right-10 z-10 w-24 rounded-xl bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
};
