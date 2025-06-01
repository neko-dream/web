import {
  type FieldMetadata,
  type FormMetadata,
  getSelectProps,
} from "@conform-to/react";
import { useControl } from "node_modules/@conform-to/react/integrations";
import { type ChangeEvent, useMemo } from "react";
import municipality from "~/assets/data/adress/municipality.json";
import prefectures from "~/assets/data/adress/prefectures.json";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Tip } from "~/components/ui/tip";
import { isCity, isFieldsError } from "~/libs/form";

type Props = {
  // FIXME: 正味このコンポーネントはupdateしか読んでないのでanyでもいいのだが...
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  form: FormMetadata<any, string[]>;
  fields: {
    prefecture: FieldMetadata<string | null | undefined>;
    city: FieldMetadata<string | null | undefined>;
  };
  required?: {
    prefecture?: boolean;
    city?: boolean;
  };
};

const prefecturesOptions = prefectures.map((v) => ({ value: v, title: v }));

/**
 * 都道府県の入力は複数箇所で使うので共通化
 */
export const AddressInputs = ({ form, fields, required }: Props) => {
  // 都道府県が選択されたら市町村の選択肢を変更
  const municipalityOptions = useMemo(() => {
    if (isCity(fields.prefecture.value)) {
      return municipality[fields.prefecture.value].map((v) => ({
        value: v,
        title: v,
      }));
    }
    return [];
  }, [fields.prefecture.value]);

  /**
   * 以前と異なる都道府県が洗濯くされたら市町村のフォームをリセットする
   */
  const handleResetCity = (e: ChangeEvent<HTMLSelectElement>) => {
    if (prefectureControl.value !== e.currentTarget.value) {
      form.update({
        name: fields.city.name,
        value: undefined,
      });
    }
  };

  const prefectureControl = useControl(fields.prefecture);

  return (
    <>
      <Label
        title="都道府県"
        optional={true}
        errors={fields.prefecture.errors}
        tip={required?.prefecture && <Tip label="必須" required={true} />}
      >
        <Select
          {...getSelectProps(fields.prefecture)}
          value={fields.prefecture.value}
          onChange={handleResetCity}
          error={isFieldsError(fields.prefecture.errors)}
          options={prefecturesOptions}
        />
      </Label>

      <Label
        title="市町村"
        optional={true}
        errors={fields.city.errors}
        tip={required?.city && <Tip label="必須" required={true} />}
      >
        <Select
          {...getSelectProps(fields.city)}
          value={fields.city.value}
          error={isFieldsError(fields.city.errors)}
          placeholder={
            fields.prefecture.value ? "選択する" : "都道府県を選択してください"
          }
          style={{
            userSelect: fields.prefecture.value ? "auto" : "none",
          }}
          tabIndex={fields.prefecture.value ? 0 : -1} // 都道府県未選択時はフォーカス不能
          options={municipalityOptions}
        />
      </Label>
    </>
  );
};
