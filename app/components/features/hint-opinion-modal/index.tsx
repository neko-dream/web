import { CenterDialog, type ModalProps } from "~/components/ui/modal";

export const HintOpinionModal = (props: Omit<ModalProps, "children">) => {
  return (
    <CenterDialog {...props}>
      <div className=" font-bold text-[#8E8E93] text-lg">投稿のルール</div>
      <p>
        ことひろは、より良い意思決定のため、あらゆる人々がオープンに話せる場所を目指しています。
      </p>
      <p>
        ただし、
        <a
          href="https://static.kotohiro.com/tos"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mt-blue-600"
        >
          利用規約
        </a>
        に違反する内容は許可していません。
      </p>
      <p>【例】</p>
      <li>卑猥な発言、攻撃的な発言</li>
      <li>セッションとは関係のない発言</li>
      <li>スパム</li>
      <p>
        不適切な投稿内容の場合、セッション作成者または運営が投稿を削除することがあります。
      </p>
    </CenterDialog>
  );
};
