import { Graph } from "~/feature/graph/components";
import { useNavigate } from "react-router";
import { Left } from "~/components/Icons";

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[#F2F2F7]">
      <button
        className="cursor-pointerp-2 flex w-full bg-white p-2 text-[18px] font-bold"
        onClick={() => navigate(-1)}
      >
        <Left className="text-black" />
        <span className="mx-auto -translate-x-[13.5px]">
          西山公園で野外ライブを開催したい
        </span>
      </button>

      <Graph />

      <div className="m-4 rounded-md bg-white p-2">
        <div className="flex items-center space-x-2">
          <img src="/icon.png" alt="" className="m-1 h-7" />
          <p className="text-xs text-gray-500">ことひろAIレポート</p>
        </div>
        <p className="mt-1 text-sm text-gray-800">
          公園でのライブイベントの開催に関するセッションは、Aグループ、Bグループ、そしてCグループの3つの立場に分かれています。
          ・Aグループ
          公園が地域住民にとってアクセスしやすい場所であり、音楽を無料で楽しめる機会を提供することの重要性を強調。
          特に、音楽が地域のコミュニティ活動を活性化させ、住民同士のつながりを深める場となると主張。公園という開かれた空間が、音楽を通じて多様な人々を引き寄せ、地域の文化的な魅力を高めることができるとしました。また、若いアーティストにとっても、自分の音楽を広める貴重な機会となり、地域全体の文化的な豊かさにも寄与するとの意見がありました。
          ・Bグループ 公園でのライブが騒音問題を引き起こす可能性を強く懸念。
          特に周囲の住民や家族連れにとって、音楽の音量が大きくなることで不快に感じることがあると指摘しました。静かな場所を求める人々に対する配慮が欠けてしまう可能性があるため、公園は音楽イベントに適した場所ではないとしました。また、公園の管理者としては、清掃やゴミ処理、さらには音響設備の設置・管理など、追加的なコストと労力が必要になることも懸念材料として挙げられました。更に、出演者の選定や音楽の内容についても、公正性が求められるため、準備段階での慎重な調整が必要だとの意見がありました。
          ・Cグループ
          賛成派と反対派の意見を総合的に考慮した上で、一定の条件付きでの実施を提案しました。具体的には、ライブイベントの開催にあたり、事前に地域住民の意見を募り、時間帯や音量に関して明確な規制を設けることが求められました。また、公園の管理や運営に影響を与えないよう、ボランティアスタッフや地域団体と連携し、協力体制を整えることが提案されました。この立場は、公園でのイベントが地域にとってポジティブな影響を与える可能性を認めつつも、配慮と調整が重要だと強調しました。
        </p>
      </div>
    </div>
  );
}
