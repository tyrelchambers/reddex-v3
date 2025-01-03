import { api } from "~/utils/api";

const Stats = () => {
  const { data: stats } = api.stats.get.useQuery();

  if (!stats) {
    return null;
  }

  const _stats = [
    {
      data: stats.users,
      desc: "Narrators using Reddex",
    },
    {
      data: stats.posts ?? 0,
      desc: "Total search results",
    },
    {
      data: stats.stories,
      desc: "Stories submitted to narrators",
    },
  ];
  return (
    <section className="relative mx-2 rounded-xl bg-gray-900 py-28 xl:mx-0">
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="max-w-2xl lg:mx-auto lg:text-center">
          <h3 className="text-3xl font-semibold text-white sm:text-4xl">
            Narrators love Reddex!
          </h3>
          <p className="mt-3 text-gray-300">
            Seriously, Reddex can save you a boat load of time and gives you a
            ton of cool features
          </p>
        </div>
        <div className="mt-12">
          <ul className="flex flex-col flex-wrap items-center justify-center gap-x-12 gap-y-10 space-y-8 sm:flex-row sm:space-y-0 lg:justify-center">
            {_stats.map((item, idx) => (
              <li
                key={idx}
                className="flex flex-col items-center sm:max-w-[15rem]"
              >
                <h4 className="text-4xl font-semibold text-white">
                  {item.data}
                </h4>
                <p className="mt-3 text-center font-medium text-gray-400">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="absolute inset-0 mx-auto h-80 max-w-md blur-[118px] sm:h-72"
        style={{
          background:
            "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
        }}
      ></div>
    </section>
  );
};

export default Stats;
