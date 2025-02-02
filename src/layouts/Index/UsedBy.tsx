import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const usedBy = [
  {
    name: "Mr.CreepyPasta",
    channel: "@MrCreepyPasta",
    subs: "1.69M",
  },
  {
    name: "AsTheRavenDreams",
    channel: "@AsTheRavenDreams",
    subs: "40.6K",
  },
  {
    name: "Stories After Midnight",
    channel: "@StoriesAfterMidnight",
    subs: "10.1K",
  },
  {
    name: "To_42",
    channel: "@To42Reads",
    subs: "4.57K",
  },
  {
    name: "Margbot",
    channel: "@Margbot",
    subs: "3.92K",
  },
  {
    name: "GothicRose",
    channel: "@GothicRose",
    subs: "1.86K",
  },
  {
    name: "Dead Leaf Clover",
    channel: "@DeadLeafClover",
    subs: "2.46K",
  },
];

const UsedBy = () => {
  return (
    <section className="mx-2 xl:mx-0">
      <p className="mb-8 text-center text-3xl font-bold text-foreground">
        Trusted by these great narrators
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {usedBy.map((u) => (
          <li
            key={u.channel}
            className="relative flex flex-col items-start gap-4 overflow-hidden rounded-xl bg-linear-to-tl from-gray-200 to-gray-100 p-4 text-xl shadow-sm xl:text-2xl"
          >
            <div className="relative z-10 flex flex-col items-start gap-3">
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-xl text-foreground/70"
              />
              <p className="font-medium">{u.name}</p>
              <p className="text-foreground/50">{u.subs}</p>
            </div>
            <FontAwesomeIcon
              icon={faYoutube}
              className="absolute -right-14 top-1/2 -translate-y-1/2 text-[12rem] text-foreground/10"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UsedBy;
