import axios from "axios";
import { env } from "~/env";

interface Props {
  domainName: string;
  websiteId: string;
}
export const createDeployment = async (data: Props) => {
  await axios.post(env.K8S_URL, data);
};

export const deleteDeployment = async (data: Props) => {
  await axios.delete(env.K8S_URL, {
    data: data,
  });
};
