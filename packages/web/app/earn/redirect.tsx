import { redirect } from "next/navigation";
import { useGetVaults } from "../api";

export default function Redirect() {
  const { data } = useGetVaults({ symbols: true });

  const [{ symbol }] = data.vaults;
  redirect("/earn/" + symbol);

  return <></>;
}
