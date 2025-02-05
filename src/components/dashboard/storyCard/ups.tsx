import { faUp } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Ups = ({ ups }: { ups: number }) => (
  <div className="text-foreground mr-6 flex flex-col items-center rounded-full font-black">
    <FontAwesomeIcon icon={faUp} />
    <span className="text-xl">{ups}</span>
  </div>
);

export default Ups;
