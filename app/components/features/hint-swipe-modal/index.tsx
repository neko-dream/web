import { CenterDialog, type ModalProps } from "~/components/ui/modal";

export const HintSwipeModal = (props: Omit<ModalProps, "children">) => {
  return (
    <CenterDialog {...props}>
      <div className="max-w-sm space-y-4 p-5">
        {/* タイトル */}
        <h2 className="text-center font-bold text-xl">操作ヒント</h2>

        {/* 説明文 */}
        <p className="mb-4 text-center">みんなの意見が真ん中に表示されます。</p>

        {/* 良さそうセクション */}
        <div className="space-y-2">
          <p className="text-gray-500">
            良さそう<span className="text-yellow-500">😊</span>と思ったら...
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>意見を右にスワイプ👉</li>
            <li>または「良さそうボタン」をタップ</li>
          </ul>
        </div>

        {/* 違うかもセクション */}
        <div className="space-y-2">
          <p className="text-gray-500">
            違うかも<span className="text-yellow-500">😞</span>と思ったら...
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>意見を左にスワイプ👈</li>
            <li>または「違うかもボタン」をタップ</li>
          </ul>
        </div>

        {/* 回答パスセクション */}
        <div className="space-y-2">
          <p className="text-gray-500">
            回答パス<span className="text-gray-500">⏭</span>と思ったら...
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>「パスボタン」をタップ</li>
          </ul>
          <p className="text-gray-400 text-sm">※スワイプでパスはできません</p>
        </div>

        {/* 詳細リンク */}
        <div className="pt-2 text-center">
          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="text-mt-blue-600"
          >
            💡より詳しい説明はこちら
          </a>
        </div>
      </div>
    </CenterDialog>
  );
};
