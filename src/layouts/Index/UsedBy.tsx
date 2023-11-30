const usedBy = [
  "Mr.CreepyPasta",
  "AsTheRavenDreams",
  "Stories After Midnight",
  "TheDarkNarrator",
  "To_42",
  "TheOminousDarkness",
  "Margbot",
  "GothicRose",
  "OriginalGensen",
  "Dead Leaf Clover",
];

const UsedBy = () => {
  return (
    <section className="mx-2 xl:mx-0">
      <p className="text-center font-bold text-muted-foreground">
        Trusted by these great narrators
      </p>

      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {usedBy.map((u) => (
          <li
            key={u}
            className="text-xl font-black text-foreground xl:text-3xl"
          >
            {u}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UsedBy;
