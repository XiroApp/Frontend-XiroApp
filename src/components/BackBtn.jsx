import propTypes from "prop-types";
import { twJoin } from "tailwind-merge";

export default function BackBtn({ close, styles }) {
  return (
    <button
      type="button"
      onClick={close}
      className={twJoin(
        styles,
        "p-1 mt-1 mr-1 text-black bg-slate-50 border-[1.5px] hover:bg-slate-200 rounded-lg absolute top-2 right-2"
      )}
    >
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}

BackBtn.propTypes = {
  close: propTypes.func.isRequired,
  styles: propTypes.string,
};
