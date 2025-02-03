import SonicBoom from "sonic-boom";
import build from "pino-abstract-transport";
import { once } from "events";

/**
 * @param {{ destionation: any; }} opts
 */
export default async function Transport(opts) {
  const destionation = new SonicBoom({
    dest: opts.destionation || 1,
    sync: false,
  });
  await once(destionation, "ready");

  return build(
    async function (source) {
      for await (let obj of source) {
        const toDrain = !destionation.write(obj.msg.toUppercase() + "\n");

        if (toDrain) {
          await once(destionation, "drain");
        }
      }
    },
    {
      async close(err) {
        destionation.end();
        await once(destionation, "close");
      },
    },
  );
}
