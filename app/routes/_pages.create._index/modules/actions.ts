// import { openReverseGeocoder } from "@geolonia/open-reverse-geocoder";
import { normalize } from "@geolonia/normalize-japanese-addresses";
import { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const t = formData.get("type");

  if (t === "reverseGeocoder") {
    const lat = formData.get("latitude");
    const lng = formData.get("longitude");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const openReverseGeocoder = (args: any): any => args;
      const result = await openReverseGeocoder([Number(lng), Number(lat)]);
      return {
        prefecture: result.prefecture,
        city: result.city,
      };
    } catch (error) {
      return { error: "住所の取得に失敗しました" };
    }
  }

  if (t === "normalizeGeocoder") {
    const prefecture = formData.get("prefecture");
    const city = formData.get("city");

    try {
      // 住所を正規化
      const normalized = await normalize(`${prefecture}${city}`);

      if (
        !normalized ||
        !normalized.point ||
        !normalized.point?.lat ||
        !normalized.point?.lng
      ) {
        return { error: "住所の正規化に失敗しました" };
      }

      return {
        lat: normalized.point?.lat,
        lng: normalized.point?.lng,
      };
    } catch (error) {
      return { error: "処理に失敗しました" };
    }
  }
};
