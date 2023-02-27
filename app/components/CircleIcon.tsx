import type { CircleVariants } from "~/routes/styles.css";
import { circles } from "~/routes/styles.css";

export const CircleIcon = ({
  color,
  size,
  className,
}: {
  className?: string;
} & CircleVariants) => {
  return <div className={[circles({ color, size }), className].join(" ")} />;
};
