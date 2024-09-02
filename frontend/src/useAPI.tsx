import { useEffect, useState } from "react";

const server = import.meta.env.VITE_SERVER;
const port = import.meta.env.VITE_PORT;
const echo = import.meta.env.VITE_ECHO;
const endpoint = `http://${server}:${port}${echo}`;
console.log(server, port, echo, endpoint);

export const useAPI = () => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    fetch(endpoint, { method: "GET" })
      .then((res) => {
        console.log("res", res);
        return res.json();
      })
      .then((resData) => {
        console.log("data", resData);

        setData(resData.message);
      })
      .catch((rej) => {
        console.log("Error", rej);
        setData('Error');
      });
  }, []);

  return {
    response: data,
  };
};
