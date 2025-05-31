import dayjs from "dayjs";
import { CSSProperties, FC, useEffect, useRef, useState } from "react";

// Removed MUI imports

import { DateScrollPicker, DateScrollPickerProps } from "./DateScrollPicker"; // Assumed MUI-free

// --- Reusable Icon Placeholders (replace with actual SVGs or icon components) ---
const CloseIconPlaceholder = () => <span aria-label="close icon">X</span>;
// --- End Icon Placeholders ---

// --- InputDateContent (MUI-free version from previous step) ---
const InputDateContent: FC<
  {
    initialDate: string;
    onCancel: () => void;
    onSubmit: (newDate: string) => void; // Changed from (newDate: Date) => void
  } & Pick<DateScrollPickerProps, "minDate" | "maxDate">
> = ({ initialDate, onCancel, onSubmit, ...restProps }) => {
  // currentDate is now a string "YYYY-MM-DD"
  const [currentDate, setCurrentDate] = useState<string>(initialDate);

  const contentStyle: CSSProperties = {
    padding: "16px 24px",
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  };

  const actionsStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "8px 24px",
  };

  const buttonBaseStyle: CSSProperties = {
    padding: "6px 8px",
    minWidth: "64px",
    boxSizing: "border-box",
    transition:
      "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
    borderRadius: "4px",
    border: "1px solid transparent",
    cursor: "pointer",
    margin: "0 8px 0 0",
  };

  const containedButtonStyle: CSSProperties = {
    ...buttonBaseStyle,
    color: "#fff",
    backgroundColor: "#1976d2", // Example MUI primary blue
    boxShadow:
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
  };

  const textButtonStyle: CSSProperties = {
    ...buttonBaseStyle,
    color: "#1976d2", // Example MUI primary blue
    backgroundColor: "transparent",
  };

  return (
    <>
      <div style={contentStyle}>
        <DateScrollPicker
          value={currentDate} // Pass string date to DateScrollPicker
          onChangeValue={setCurrentDate} // DateScrollPicker's onChangeValue now provides a string
          {...restProps}
        />
      </div>
      <div style={actionsStyle}>
        <button type="button" style={textButtonStyle} onClick={onCancel}>
          キャンセル
        </button>
        <button
          type="button"
          style={containedButtonStyle}
          onClick={() => {
            onSubmit(currentDate);
          }}
        >
          決定
        </button>
      </div>
    </>
  );
};
// --- End InputDateContent ---

const DEFAULT_INITIAL_PICKER_DATE = dayjs().format("2000-05-04");

export type InputDateByScrollPickerProps = {
  value: string | null; // Changed from Date | null
  pickerUi: "dialog" | "popover";
  initialPickerDate?: string; // Changed from Date | undefined
  onChangeValue: (newValue: string | null) => void; // Changed to emit string | null
} & Pick<DateScrollPickerProps, "minDate" | "maxDate">;

export const InputDateByScrollPicker: FC<InputDateByScrollPickerProps> = ({
  value,
  pickerUi,
  initialPickerDate = DEFAULT_INITIAL_PICKER_DATE, // Now defaults to a string date
  onChangeValue,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [elAnchor, setElAnchor] = useState<HTMLDivElement | null>(null); // Changed to HTMLDivElement for the input wrapper
  const popoverRef = useRef<HTMLDivElement>(null);

  // Basic styling for TextField replacement
  const textFieldWrapperStyle: CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "11px 14px", // Approximates MUI small outlined TextField
    paddingRight: "60px", // Make space for icons
    fontSize: "1rem",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    border: "1px solid oklch(0.872 0.01 258.338)",
    borderRadius: "6px",
    boxSizing: "border-box",
    cursor: "pointer",
    backgroundColor: "#fff",
  };

  const inputAdornmentStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
  };

  const iconButtonStyle: CSSProperties = {
    background: "none",
    border: "none",
    padding: "4px", // Approximates IconButton padding
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    marginLeft: "4px",
  };

  // Basic Dialog styling
  const dialogOverlayStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1300, // MUI Dialog z-index
  };

  const dialogContentWrapperStyle: CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow:
      "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
    overflow: "hidden", // To contain InputDateContent borders
  };

  // Basic Popover styling
  const popoverStyle: CSSProperties = {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow:
      "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)",
    zIndex: 1301, // MUI Popover z-index (typically higher than Dialog)
    // Positioning will be handled by JavaScript
  };

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(true);
    setElAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (pickerUi === "popover") {
      setElAnchor(null);
    }
  };

  const handleSubmit = (newDate: string) => {
    // Changed from (newDate: Date)
    onChangeValue(newDate); // newDate is already "YYYY-MM-DD" string
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  // Effect for Popover positioning (very basic example)
  useEffect(() => {
    if (pickerUi === "popover" && isOpen && elAnchor && popoverRef.current) {
      const anchorRect = elAnchor.getBoundingClientRect();
      const popoverElem = popoverRef.current;
      // Position below the anchor
      popoverElem.style.top = `${anchorRect.bottom + window.scrollY}px`;
      popoverElem.style.left = `${
        anchorRect.left +
        window.scrollX +
        anchorRect.width / 2 -
        popoverElem.offsetWidth / 2
      }px`;
      // Add more sophisticated positioning and collision detection as needed
    }
  }, [isOpen, elAnchor, pickerUi]);

  return (
    <>
      <div
        style={textFieldWrapperStyle}
        onClick={handleOpen}
        ref={
          pickerUi === "popover"
            ? (elAnchor) => setElAnchor(elAnchor)
            : undefined
        }
      >
        <input
          type="text"
          style={inputStyle}
          value={value ? dayjs(value).format("YYYY/MM/DD") : ""} // value is "YYYY-MM-DD" string
          placeholder="選択してください"
          readOnly
        />
        <div style={inputAdornmentStyle}>
          {value != null && (
            <button
              type="button"
              style={iconButtonStyle}
              onClick={(event) => {
                event.stopPropagation(); // Prevent opening picker
                onChangeValue(null);
              }}
            >
              <CloseIconPlaceholder />
            </button>
          )}
        </div>
      </div>

      {isOpen && pickerUi === "dialog" && (
        <div style={dialogOverlayStyle} onClick={handleCancel}>
          <div
            style={dialogContentWrapperStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <InputDateContent
              {...restProps}
              initialDate={value ?? initialPickerDate} // Pass string date "YYYY-MM-DD"
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      {isOpen && pickerUi === "popover" && elAnchor && (
        <div ref={popoverRef} style={popoverStyle}>
          {/* A backdrop for popover to handle outside clicks might be needed */}
          {/* <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1}} onClick={handleCancel} /> */}
          <InputDateContent
            {...restProps}
            initialDate={value ?? initialPickerDate} // Pass string date "YYYY-MM-DD"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </>
  );
};
