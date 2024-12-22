import { getFormProps, getInputProps } from "@conform-to/react";
import { Form } from "react-router";
import { Suspense, useState, lazy, useEffect, useRef } from "react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Textarea from "~/components/Textarea";
import { isFieldsError } from "~/libs/form";
import AdressInputs from "~/feature/form/components/AdressInputs";
import { useCreateSessionForm } from "./hooks/useCreateSessionForm";
import { LatLng, PrefectureCity } from "./types";
import { normalize, reverse } from "./libs";
import { defaultLagLng } from "./constants/defaultValue";

const Map = lazy(() => import("./components/Map"));

/**
 * ====================================
 *
 * FIXME: とりあえず動くように再レンダリング抑制する
 *
 * ====================================
 */
export default function Page() {
  const adressRef = useRef<PrefectureCity>();
  const [lagLng, setLagLng] = useState<LatLng>();
  const [zoom, setZoom] = useState(18);
  const [showLocationFields, setShowLocationFields] = useState(false);

  const { form, fields } = useCreateSessionForm();

  useEffect(() => {
    form.update({
      name: fields.latitude.name,
      value: lagLng?.lat,
    });
    form.update({
      name: fields.longitude.name,
      value: lagLng?.lng,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lagLng]);

  const handlePositionChange = async (lat: number, lng: number) => {
    setLagLng({ lat, lng });
    const prefectureCity = await reverse({ lat, lng });

    if (prefectureCity) {
      if (form.value?.city !== "---") {
        form.update({
          name: fields.city.name,
          value: "---",
        });
      }
      if (form.value?.prefecture !== "---") {
        form.update({
          name: fields.prefecture.name,
          value: "---",
        });
      }
    }
  };

  useEffect(() => {
    normalize({
      prefecture: fields.prefecture.value || "",
      city: fields.city.value || "",
    }).then((data) => data && setLagLng(data));
    adressRef.current = {
      prefecture: fields.prefecture.value || "",
      city: fields.city.value || "",
    };
  }, [fields.city.value, fields.prefecture.value]);

  useEffect(() => {
    const success = (pos: GeolocationPosition) => {
      setLagLng({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    };

    // 今は使わない
    const error = () => {};

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });
  }, []);

  function LazyMap() {
    return (
      <Suspense fallback={<div>Loading map...</div>}>
        <Map
          onLatLngChange={handlePositionChange}
          position={lagLng ?? defaultLagLng}
          onZoom={setZoom}
          zoom={zoom}
        />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col">
      <Heading className="h-10">投稿されたセッション</Heading>
      <Form
        {...getFormProps(form)}
        onSubmit={form.onSubmit}
        method="post"
        className="m-4 space-y-4"
      >
        <Label title="セッションタイトル" required errors={fields.theme.errors}>
          <Input
            {...getInputProps(fields.theme, { type: "text" })}
            error={isFieldsError(fields.theme.errors)}
            className="h-12 w-full px-4"
            placeholder="記入する"
          />
        </Label>

        <Label title="説明文" optional>
          <Textarea
            {...getInputProps(fields.description, { type: "text" })}
            error={isFieldsError(fields.description.errors)}
            className="h-12 w-full p-[14px]"
            placeholder="記入する"
          />
        </Label>

        <Label title="セッション終了日時" required>
          <Input
            {...getInputProps(fields.scheduledEndTime, {
              type: "text",
            })}
            type="date"
            className="h-12 w-full px-4"
            placeholder="記入する"
          />
        </Label>

        <Label title="関係のある場所" optional>
          <Input className="h-12 w-full px-4" placeholder="記入する" />
        </Label>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLocationFields}
            onChange={(e) => setShowLocationFields(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-600">
            関連する場所の位置情報を追加する
          </span>
        </div>

        {showLocationFields && (
          <>
            <AdressInputs form={form as never} fields={fields as never} />

            <Label title="位置情報" optional>
              <LazyMap />
            </Label>

            <input
              {...getInputProps(fields.latitude, { type: "number" })}
              hidden
            />
            <input
              {...getInputProps(fields.longitude, { type: "number" })}
              hidden
            />
          </>
        )}

        <Button
          variation="primary"
          type="submit"
          className="mx-auto !mt-12 block"
        >
          登録する
        </Button>
      </Form>
    </div>
  );
}
