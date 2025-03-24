import { getSelectProps, useForm } from "@conform-to/react";
import { useControl } from "node_modules/@conform-to/react/integrations";
import { useMemo } from "react";
import * as v from "valibot";
import municipality from "~/assets/data/adress/municipality.json";
import prefectures from "~/assets/data/adress/prefectures.json";
import { Label } from "~/components/Label";
import Select from "~/components/Select";
import { adressFormSchema } from "~/features/user/schemas/form";
import { isCity, isFieldsError } from "~/libs/form";

type Output = v.InferOutput<typeof adressFormSchema>;

type Props = {
  form: ReturnType<typeof useForm<Output>>[0];
  fields: ReturnType<typeof useForm<Output>>[1];
};

/**
 * 都道府県の入力は複数箇所で使うので共通化
 */
export default function AdressInputs({ form, fields }: Props) {
  // 都道府県が選択されたら市町村の選択肢を変更
  const municipalityOptions = useMemo(() => {
    if (isCity(fields.prefecture.value)) {
      return municipality[fields.prefecture.value].map((v) => ({
        value: v,
        title: v,
      }));
    } else {
      return [];
    }
  }, [fields.prefecture.value]);

  const prefectureControl = useControl(fields.prefecture);

  return (
    <>
      <Label title="都道府県" optional errors={fields.prefecture.errors}>
        <Select
          {...getSelectProps(fields.prefecture)}
          onChange={(e) => {
            // 同じ都道府県が選択されたら何もしない
            if (prefectureControl.value === e.currentTarget.value) {
              return;
            }
            form.update({
              name: fields.city.name,
              value: undefined,
            });
            prefectureControl.change(e.currentTarget.value);
          }}
          error={isFieldsError(fields.prefecture.errors)}
          options={prefectures.map((v) => ({ value: v, title: v }))}
        />
      </Label>

      <Label title="市町村" optional errors={fields.city.errors}>
        <Select
          {...getSelectProps(fields.city)}
          disabled={!fields.prefecture.value}
          error={isFieldsError(fields.city.errors)}
          placeholader={
            fields.prefecture.value ? "選択する" : "都道府県を選択してください"
          }
          options={municipalityOptions}
        />
      </Label>
    </>
  );
}
