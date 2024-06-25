import MainMap from "@/components/MainMap/MainMap";
import StoreProvider from "./StoreProvider";
import config from "@/utils/config";
export default function Home() {
  const { minLat, minLon, maxLat, maxLon } = config.country;
  return (
    <>
      <StoreProvider>
        <MainMap bbox={{ minLat, minLon, maxLat, maxLon }} />
      </StoreProvider>
    </>
  );
}
