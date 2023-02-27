import { useTimer } from "react-timer-hook";
import { ClockIcon } from "~/components/ClockIcon";
import { formatTime } from "~/utils";

export const CountdownTimer = ({
  expiryTimestamp,
}: {
  expiryTimestamp: Date;
}) => {
  const { seconds, minutes } = useTimer({
    expiryTimestamp: expiryTimestamp || new Date(),
  });
  return (
    <>
      <ClockIcon />
      <span>
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </>
  );
};
