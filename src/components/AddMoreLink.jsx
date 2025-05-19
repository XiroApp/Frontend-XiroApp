import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { twJoin } from "tailwind-merge";

AddMoreLink.propTypes = {
  to: propTypes.string,
  text: propTypes.string.isRequired,
  styles: propTypes.string,
};

export default function AddMoreLink({ to, text, styles }) {
  if (to) {
    return (
      <Link
        to={to}
        className={twJoin(
          "pb-2 w-fit text-[14px] text-green-900 hover:underline hover:text-green-700",
          styles
        )}
      >
        +&nbsp;{text}
      </Link>
    );
  } else {
    return (
      <span
        className={twJoin(
          "pb-2 w-fit text-[14px] text-green-900 hover:underline hover:text-green-700",
          styles
        )}
      >
        +&nbsp;{text}
      </span>
    );
  }
}
