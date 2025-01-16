import axios from "axios";

interface Props {
  domainName: string;
  websiteId: string;
}
export const createDeployment = async (data: Props) => {
  await axios.post("http://localhost:8080", data);
};

export const deleteDeployment = async (data: Props) => {
  await axios.delete("http://localhost:8080", {
    data: data,
  });
};
