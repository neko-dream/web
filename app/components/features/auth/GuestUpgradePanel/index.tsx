import { AuthProviderLinks } from "../AuthProviderLinks";

/**
 * ゲストからGoogle/LINEアカウントへ引き継ぐための導線
 */
export const GuestUpgradePanel = () => {
  return (
    <section>
      <div className="mx-auto w-full max-w-[400px] px-4 py-8 text-center">
        <p className="font-bold text-[18px] text-ink">アカウントを引き継ぐ</p>
        <p className="mt-2 text-[13px] text-ink-muted leading-6">
          ゲストのままではプロフィールを編集できません。GoogleまたはLINEでログインすると、今のデータを引き継いで編集できるようになります。
        </p>
        <div className="mt-6">
          <AuthProviderLinks />
        </div>
      </div>
    </section>
  );
};
