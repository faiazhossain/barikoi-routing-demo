import MainMap from "@/components/MainMap/MainMap";
import StoreProvider from "./StoreProvider";
import config from "@/utils/config";
export default function Home() {
  const { minLat, minLon, maxLat, maxLon, countryName } = config.country;
  // const { name } = config.countryName;
  return (
    <>
      <StoreProvider>
        <MainMap
          bbox={{ minLat, minLon, maxLat, maxLon, countryName }}
          // countryName={{ name }}
        />
      </StoreProvider>
    </>
  );
}
