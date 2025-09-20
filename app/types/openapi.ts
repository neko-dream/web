export interface paths {
  "/auth/dev/detach": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /**
     * **開発用** 現在のアカウントを切り離す
     * @description そのアカウントには再度ログインできなくなります。ログインしたければ言ってね！
     */
    delete: operations["authAccountDetach"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/dev/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 開発用登録/ログイン */
    get: operations["devAuthorize"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/password/change": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /** パスワード変更 */
    put: operations["changePassword"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/password/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** パスワードによるログイン */
    post: operations["passwordLogin"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/password/register": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** パスワードによる登録（devのみ） */
    post: operations["passwordRegister"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/reactivate": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 退会ユーザーの復活 */
    post: operations["reactivateUser"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/revoke": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** トークンを失効（ログアウト） */
    post: operations["revokeToken"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/token/info": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** JWTの内容を返してくれる */
    get: operations["getTokenInfo"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/{provider}/callback": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Auth Callback */
    get: operations["handleAuthCallback"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/auth/{provider}/login": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** ログイン */
    get: operations["authorize"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/health": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** ヘルスチェック */
    get: operations["health"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/images": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 画像投稿
     * @description 画像を投稿してURLを返すAPI
     */
    post: operations["postImage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/devices": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** デバイス一覧取得 */
    get: operations["getDevices"];
    put?: never;
    /** デバイス登録/更新 */
    post: operations["registerDevice"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/devices/exists": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** デバイストークンが登録されているか確認 */
    get: operations["checkDeviceExists"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/devices/{deviceId}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** デバイス削除 */
    delete: operations["deleteDevice"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/preferences": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 通知設定取得 */
    get: operations["getNotificationPreferences"];
    /** 通知設定更新 */
    put: operations["updateNotificationPreferences"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/test": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** テスト通知送信 */
    post: operations["sendTestNotification"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/notifications/vapid-key": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** VAPID公開鍵取得 */
    get: operations["getVapidKey"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * セッションに対して意見投稿 or 意見に対するリプライ
     * @description parentOpinionIDがなければルートの意見として投稿される
     *     parentOpinionIDがない場合はtalkSessionIDが必須
     *
     *     セッション管理者はisSeedをtrueにするとシード意見として投稿できる
     */
    post: operations["postOpinionPost2"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/histories": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 今までに投稿した意見 */
    get: operations["opinionsHistory"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/report_reasons": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 意見への通報理由一覧 */
    get: operations["getOpinionReportReasons"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 意見詳細 */
    get: operations["getOpinionDetail2"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/analysis": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 意見に投票したグループごとの割合 */
    get: operations["getOpinionAnalysis"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/replies": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 意見に対するリプライ意見一覧 */
    get: operations["opinionComments2"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/report": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 意見通報API */
    post: operations["reportOpinion"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/reports": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * 意見に対する通報取得
     * @description セッション作成者しか取得できない
     */
    get: operations["getOpinionReports"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/reports/solve": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 通報を解決 */
    post: operations["solveOpinionReport"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/opinions/{opinionID}/votes": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 意思表明API */
    post: operations["vote2"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organization/{code}/validate": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 組織コード検証 */
    get: operations["validateOrganizationCode"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 所属組織一覧 */
    get: operations["getOrganizations"];
    put?: never;
    /**
     * 組織作成（運営ユーザーのみ）
     * @description 組織を作成できる。
     *     これを作れるユーザーはDBを直接叩いて作るしかない。
     */
    post: operations["establishOrganization"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/aliases": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 組織エイリアス一覧取得 */
    get: operations["getOrganizationAliases"];
    put?: never;
    /** 組織エイリアス作成 */
    post: operations["createOrganizationAlias"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/aliases/{aliasID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    /** 組織エイリアス削除 */
    delete: operations["deleteOrganizationAlias"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/invite": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * 組織ユーザー招待（運営ユーザーのみ）
     * @description Role
     *     - 10: SuperAdmin
     *     - 20: Owner
     *     - 30: Admin
     *     - 40: Member
     */
    post: operations["inviteOrganization"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/invite_user": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 組織にユーザーを追加 */
    post: operations["inviteOrganizationForUser"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/switch/{code}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** 組織切り替え */
    post: operations["switchOrganization"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/users": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 現在の組織のユーザー一覧取得 */
    get: operations["getOrganizationUsers"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/organizations/{code}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * 組織更新（組織のAdmin以上のユーザーのみ）
     * @description 組織を更新できる。
     *     組織のAdmin以上のユーザーが実行可能。
     */
    put: operations["updateOrganization"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/policy/consent": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 最新のポリシーに同意したかを取得 */
    get: operations["getPolicyConsentStatus"];
    put?: never;
    /** 最新のポリシーに同意する */
    post: operations["policyConsent"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/report/feedback": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** セッションのレポートにフィードバックを適用する */
    post: operations["applyFeedbackToReport"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** セッション一覧 */
    get: operations["getTalkSessionList"];
    put?: never;
    /**
     * セッション作成
     * @description ## サムネイル画像について
     *     - `Description中に出てくる画像で一番最初のものを使用`。
     *     - 画像自体は`POST /images`でサーバにポストしたものを使用してください。
     *
     *     ## 投稿制限のキーについて
     *     restrictionsに値を入れると一定のデモグラ情報を登録していない限り、セッションへの投稿が制限されるようにできる。
     *     restrictionsには [GET /talksessions/restrictions](https://app.apidog.com/link/project/674502/apis/api-14271260) より取れるkeyをカンマ区切りで入力してください。
     */
    post: operations["initiateTalkSession"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/histories": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** リアクション済みのセッション一覧 */
    get: operations["sessionsHistory"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/opened": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 自分が開いたセッション一覧 */
    get: operations["getOpenedTalkSession"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/restrictions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * セッションで指定可能な制限一覧
     * @description セッションの投稿制限に使用できるキーの一覧を返す
     */
    get: operations["getTalkSessionRestrictionKeys"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** トークセッションの詳細 */
    get: operations["getTalkSessionDetail"];
    /** セッション編集 */
    put: operations["editTalkSession"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/analysis": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 分析結果一覧 */
    get: operations["talkSessionAnalysis"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/conclusion": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 結論取得 */
    get: operations["getConclusion"];
    put?: never;
    /**
     * 結論投稿
     * @description 結論（conclusion）はセッションが終了した後にセッっションの作成者が投稿できる文章。
     *     セッションの流れやグループの分かれ方などに対するセッション作成者の感想やそれらの意見を受け、これからの方向性などを記入する。
     */
    post: operations["postConclusion"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/consent": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** セッションに同意しているか */
    get: operations["hasConsent"];
    put?: never;
    /** セッションへの同意 */
    post: operations["consentTalkSession"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/opinions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** セッションに対する意見一覧 */
    get: operations["getOpinionsForTalkSession"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/report": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** セッションレポートを返す */
    get: operations["getTalkSessionReport"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/reports": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 通報一覧 */
    get: operations["getReportsForTalkSession"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/reports/count": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 通報件数 */
    get: operations["getTalkSessionReportCount"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/restrictions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * セッションで満たしていない制限
     * @description 特定のセッションで満たしていない条件があれば返す
     */
    get: operations["getTalkSessionRestrictionSatisfied"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/swipe_opinions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * スワイプ用のエンドポイント
     * @description セッションの中からまだ投票していない意見をランダムに取得する
     *     remainingCountは取得した意見を含めてスワイプできる意見の総数を返す
     */
    get: operations["swipeOpinions"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/timeline": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** タイムラインアイテム追加 */
    post: operations["postTimeLineItem"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/timelines": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * タイムライン取得
     * @description タイムラインはセッション終了後にセッション作成者が設定できるその後の予定を知らせるもの
     */
    get: operations["getTimeLine"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/talksessions/{talkSessionID}/timelines/{actionItemID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /** タイムライン編集 */
    put: operations["editTimeLine"];
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/test": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** OpenAPIテスト用 */
    get: operations["test"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/test/dummy": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /** init dummy */
    post: operations["dummyInit"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/user": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** ユーザー情報の取得 */
    get: operations["getUserInfo"];
    /** ユーザー情報の変更 */
    put: operations["updateUserProfile"];
    /** ユーザー作成 */
    post: operations["establishUser"];
    /** ユーザー退会 */
    delete: operations["withdrawUser"];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/user/{displayID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 表示IDからユーザー情報の取得 */
    get: operations["getUserByDisplayID"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/users/{displayID}/talksessions": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** 特定ユーザが開いたセッション一覧 */
    get: operations["getUserTalkSessions"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/talksessions/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getTalkSessionListManage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/talksessions/{talkSessionID}": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getTalkSessionManage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/talksessions/{talkSessionID}/analysis/regenerate": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations["manageRegenerateManage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/talksessions/{talkSessionID}/analysis/report": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getAnalysisReportManage"];
    put?: never;
    post: operations["toggleReportVisibilityManage"];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/users/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUserListManage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/users/stats/list": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUserStatsListManage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  "/v1/manage/users/stats/total": {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations["getUserStatsTotalManage"];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    ActionItem: {
      actionItemID: string;
      sequence: number;
      content: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    AnalysisReportResponse: {
      /** @description レポート本文 */
      report?: string;
    };
    Conclusion: {
      /** @description 作成ユーザー */
      user: components["schemas"]["User"];
      /** @description 結論本文 */
      content: string;
    };
    /** @description Cookie-based authentication using JWT tokens stored in secure HTTP-only cookies */
    CookieAuth: {
      /**
       * @description API key authentication
       * @enum {string}
       */
      type: "apiKey";
      /**
       * @description location of the API key
       * @enum {string}
       */
      in: "cookie";
      /**
       * @description name of the API key
       * @enum {string}
       */
      name: "SessionId";
    };
    /** @description デバイス情報 */
    Device: {
      device_id: string;
      user_id: string;
      /** @enum {string} */
      platform: "ios" | "android" | "web";
      device_name?: string;
      enabled: boolean;
      last_active_at?: string;
      created_at: string;
      updated_at: string;
    };
    Error: {
      code: string;
      message: string;
    };
    Location: {
      /** @description 緯度 */
      latitude?: number;
      /** @description 経度 */
      longitude?: number;
    };
    /** @description 通知設定 */
    NotificationPreferences: {
      push_notification_enabled: boolean;
    };
    OffsetPagination: {
      totalCount: number;
      offset: number;
      limit: number;
    };
    Opinion: {
      /** @description 意見ID */
      id: string;
      title?: string;
      /** @description 意見のテキスト */
      content: string;
      /** @description 親の意見ID。ルートならば無し */
      parentID?: string;
      /** @description 意見投稿主の意見。ルート意見の場合はここには何も入らない */
      voteType?: components["schemas"]["VoteType"] | null;
      /** @description 画像が返る場合もある */
      pictureURL?: string | null;
      /** @description 参考文献URL */
      referenceURL?: string;
      postedAt: string;
      isDeleted: boolean;
    };
    OpinionGroupRatio: {
      agreeCount: number;
      disagreeCount: number;
      passCount: number;
      groupID: number;
      groupName: string;
    };
    /** @description 意見とリプライ数と投票情報を含むレスポンス */
    OpinionWithReplyAndVote: {
      opinion: components["schemas"]["Opinion"];
      user: components["schemas"]["User"];
      replyCount: number;
      myVoteType?: components["schemas"]["VoteType"] | null;
    };
    /** @description 意見とリプライ数を含むレスポンス */
    OpinionWithReplyCount: {
      opinion: components["schemas"]["Opinion"];
      user: components["schemas"]["User"];
      replyCount: number;
    };
    /** @description 意見とユーザー情報を含む基本レスポンス */
    OpinionWithUser: {
      opinion: components["schemas"]["Opinion"];
      user: components["schemas"]["User"];
    };
    /** @description 意見と投票情報を含むレスポンス */
    OpinionWithVote: {
      opinion: components["schemas"]["Opinion"];
      user: components["schemas"]["User"];
      myVoteType?: components["schemas"]["VoteType"] | null;
    };
    /** @description Optional cookie-based authentication - will populate session context if authenticated but won't require it */
    OptionalCookieAuth: {
      /**
       * @description API key authentication
       * @enum {string}
       */
      type: "apiKey";
      /**
       * @description location of the API key
       * @enum {string}
       */
      in: "cookie";
      /**
       * @description name of the API key
       * @enum {string}
       */
      name: "SessionId";
    };
    Organization: {
      /** @description 組織ID */
      ID: string;
      /** @description 組織名 */
      name: string;
      /** @description 組織コード */
      code: string;
      /** @description 組織アイコンURL */
      iconURL?: string | null;
      /** @description 組織のタイプ */
      type: number;
      /** @description ロールの名前 */
      roleName: string;
      /** @description ロール */
      role: number;
    };
    /** @description 組織エイリアス */
    OrganizationAlias: {
      aliasID: string;
      aliasName: string;
      createdAt?: string | null;
    };
    /** @description 組織ユーザー */
    OrganizationUser: {
      userID: string;
      displayID: string;
      displayName: string;
      iconURL?: string | null;
      role: number;
      roleName: string;
    };
    PolicyConsentStatus: {
      /** @description 最新ポリシーのバージョン */
      policyVersion: string;
      /** @description 同意した日時 */
      consentedAt?: string | null;
      /** @description 同意したか */
      consentGiven: boolean;
    };
    RegenerateRequest: {
      /**
       * @description 再生成するタイプ
       * @enum {string}
       */
      type: "report" | "group" | "image";
    };
    RegenerateResponse: {
      /** @description ステータス */
      status: string;
      /** @description メッセージ */
      message: string;
    };
    Report: {
      talkSessionID: string;
      /** @description レポート本文 */
      content: string;
    };
    /**
     * @description 通報解決アクション
     * @enum {string}
     */
    ReportAction: "deleted" | "hold";
    ReportDetail: {
      opinion: components["schemas"]["Opinion"];
      /** @description 作成ユーザー */
      user: components["schemas"]["User"];
      status: components["schemas"]["ReportStatus"];
      reasons: {
        reason: string;
        content?: string | null;
      }[];
      /** @description この意見が通報を受けた回数 */
      reportCount: number;
    };
    ReportReason: {
      /** @description 1 */
      reasonID: number;
      /** @description 不適切な内容 */
      reason: string;
    };
    /**
     * @description 通報ステータス
     * @enum {string}
     */
    ReportStatus: "unsolved" | "deleted" | "hold";
    Restriction: {
      key: string;
      description: string;
      /** @description 依存しているrestriction */
      dependsOn?: string[];
    };
    Success: {
      message: string;
    };
    TalkSession: {
      /** @description トークセッションID */
      id: string;
      /** @description テーマ */
      theme: string;
      /** @description 説明 */
      description?: string | null;
      /** @description 作成ユーザー */
      owner: components["schemas"]["User"];
      /** @description 作成組織名 */
      organizationAlias?: components["schemas"]["OrganizationAlias"] | null;
      /** @description 作成日時 */
      createdAt: string;
      /** @description 終了予定日時 */
      scheduledEndTime: string;
      /** @description 位置情報 */
      location?: components["schemas"]["Location"];
      /** @description 市区町村 */
      city?: string | null;
      /** @description 都道府県 */
      prefecture?: string | null;
      /** @description サムネ画像 */
      thumbnailURL?: string | null;
      /** @description セッションの参加制限 */
      restrictions: components["schemas"]["Restriction"][];
      /** @description レポートを隠すかどうか */
      hideReport: boolean;
      /** @description トップに表示するかどうか */
      hideTop?: boolean | null;
    };
    TalkSessionForManage: {
      talkSessionID: string;
      theme: string;
      description: string;
      owner: components["schemas"]["UserForManage"];
      /** Format: date-time */
      scheduledEndTime: string;
      city?: string;
      prefecture?: string;
      thumbnailURL: string;
      hidden: boolean;
      updatedAt: string;
      createdAt: string;
    };
    TalkSessionListResponse: {
      talkSessionStats: components["schemas"]["TalkSessionStats"][];
      /** Format: int32 */
      totalCount: number;
    };
    TalkSessionStats: {
      talkSessionID: string;
      theme: string;
      description: string;
      owner: components["schemas"]["UserForManage"];
      /** Format: date-time */
      scheduledEndTime: string;
      city?: string;
      prefecture?: string;
      thumbnailURL: string;
      hidden: boolean;
      updatedAt: string;
      createdAt: string;
      /** Format: int32 */
      opinionCount: number;
      /** Format: int32 */
      opinionUserCount: number;
      /** Format: int32 */
      voteCount: number;
      /** Format: int32 */
      voteUserCount: number;
    };
    ToggleReportVisibilityRequest: {
      /** @description 非表示にするかどうか */
      hidden: boolean;
    };
    ToggleReportVisibilityResponse: {
      /** @description ステータス */
      status: string;
      /** @description メッセージ */
      message: string;
    };
    TokenClaim: {
      /** @description Audience */
      aud: string;
      /** @description 有効期限 */
      exp: string;
      /** @description 発行日時 */
      iat: string;
      /** @description 発行者 */
      iss: string;
      /** @description ユーザID */
      sub: string;
      /** @description JWT ID */
      jti: string;
      /** @description ユーザーID */
      displayID?: string;
      /** @description ユーザー名 */
      displayName?: string;
      /** @description アイコンURL */
      iconURL?: string;
      /** @description ユーザ登録済みか */
      isRegistered: boolean;
      isEmailVerified: boolean;
      /** @description アカウントの種類。組織がなければ空 */
      orgType?: number | null;
      /** @description パスワードの更新が必要かどうか */
      requiredPasswordChange: boolean;
      /** @description 組織のRole */
      organizationRole?: string | null;
      /** @description 組織コード
       *     ログイン時に使用する */
      organizationCode?: string | null;
      /** @description 組織ID */
      organizationID?: string | null;
    };
    User: {
      displayID: string;
      displayName: string;
      iconURL?: string | null;
    };
    UserDemographics: {
      /**
       * 20001010
       * @description 生年月日
       */
      dateOfBirth?: number | null;
      /**
       * 性別
       * @description 性別
       */
      gender?: string | null;
      /**
       * 市町村
       * @description 市町村
       */
      city?: string | null;
      /**
       * 都道府県
       * @description 都道府県
       */
      prefecture?: string | null;
    };
    UserForManage: {
      /** @description ユーザーID */
      userID: string;
      /** @description 表示ID */
      displayID: string;
      /** @description 表示名 */
      displayName: string;
      /** @description アイコンURL */
      iconURL: string;
      /**
       * Format: date-time
       * @description 最終ログイン日時
       */
      lastLoginAt: string;
      /**
       * Format: date-time
       * @description 作成日時
       */
      createdAt: string;
      /**
       * Format: date-time
       * @description 更新日時
       */
      updatedAt: string;
    };
    UserGroupPosition: {
      posX: number;
      posY: number;
      displayID: string;
      displayName: string;
      iconURL?: string | null;
      groupName: string;
      groupID: number;
      /** @description 境界ポイントのインデックス */
      perimeterIndex?: number;
    };
    UserStatsResponse: {
      /**
       * Format: int32
       * @description ユニークアクション数
       */
      uniqueActionUserCount: number;
      /**
       * Format: int32
       * @description 登録ユーザー数
       */
      userCount: number;
      /**
       * Format: int32
       * @description セッション数
       */
      talkSessionCount: number;
      /**
       * Format: date-time
       * @description 日付
       */
      date: string;
    };
    ValidationErrorItem: {
      /** @description バリデーションエラーのフィールド */
      field: string;
      /** @description バリデーションエラーメッセージ */
      message: string;
    };
    /**
     * @description 投票タイプ
     * @enum {string}
     */
    VoteType: "agree" | "disagree" | "pass";
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  authAccountDetach: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          "Set-Cookie"?: string[];
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  devAuthorize: {
    parameters: {
      query: {
        redirect_url: string;
        /** @description devのみで使用するsubjectです。ここで指定した値はログインした後も確認できないため覚えておいてください。同じ値を指定すると同じアカウントにログインできます。 */
        id: string;
        /** @description 組織コード（組織ログインの場合） */
        organizationCode?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Redirection */
      302: {
        headers: {
          Location?: string;
          "Set-Cookie"?: string[];
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  changePassword: {
    parameters: {
      query: {
        /** @description 古いパスワード */
        oldPassword: string;
        /** @description 新たなパスワード */
        newPassword: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  passwordLogin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          idOrEmail: string;
          password: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  passwordRegister: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          password: string;
          email: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  reactivateUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            message: string;
            user: components["schemas"]["User"];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Access is forbidden. */
      403: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  revokeToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description There is no content to send for this request, but the headers may be useful.  */
      204: {
        headers: {
          /** @description Cookie削除用のSet-Cookie */
          "Set-Cookie": string[];
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTokenInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TokenClaim"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  handleAuthCallback: {
    parameters: {
      query: {
        code: string;
        /** @description OAuth State from Query */
        state: string;
      };
      header?: never;
      path: {
        provider: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Redirection */
      302: {
        headers: {
          Location: string;
          /** @description SessionID */
          "Set-Cookie": string[];
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  authorize: {
    parameters: {
      query: {
        /** @description ログイン後にリダイレクトするURL */
        redirect_url: string;
        /** @description 組織コード（組織ログインの場合） */
        organization_code?: string;
        /** @description 登録していなかった場合に飛ばすURL */
        registration_url?: string;
      };
      header?: never;
      path: {
        provider: "google" | "line";
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Redirection */
      302: {
        headers: {
          /** @description IDPのログインページ */
          Location: string;
          /** @description OAuth2.0 State */
          "Set-Cookie"?: string[];
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  health: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  postImage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          /** Format: binary */
          image: Blob;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            url: string;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getDevices: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            devices: components["schemas"]["Device"][];
          };
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  registerDevice: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description FCMトークンまたはAPNSトークン */
    requestBody: {
      content: {
        "multipart/form-data": {
          device_token: string;
          /** @enum {string} */
          platform: "ios" | "android" | "web";
          device_name?: string;
          app_version?: string;
          os_version?: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Device"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  checkDeviceExists: {
    parameters: {
      query: {
        /** @description FCMトークンまたはAPNSトークン */
        device_token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            exists: boolean;
          };
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server cannot find the requested resource. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  deleteDevice: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        deviceId: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description There is no content to send for this request, but the headers may be useful.  */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server cannot find the requested resource. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getNotificationPreferences: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["NotificationPreferences"];
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  updateNotificationPreferences: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          push_notification_enabled: boolean | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["NotificationPreferences"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  sendTestNotification: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          title: string;
          body: string;
          device_id?: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            /** Format: int32 */
            devices_count: number;
            /** Format: int32 */
            success_count: number;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getVapidKey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            vapid_key: string;
          };
        };
      };
    };
  };
  postOpinionPost2: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          talkSessionID?: string;
          parentOpinionID?: string;
          title?: string;
          opinionContent: string;
          referenceURL?: string;
          /** Format: binary */
          picture?: Blob;
          isSeed?: boolean | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Opinion"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  opinionsHistory: {
    parameters: {
      query?: {
        /** @description ソートきー */
        sort?: "latest" | "mostReplies" | "oldest" | null;
        limit?: number;
        offset?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            opinions: components["schemas"]["OpinionWithReplyCount"][];
            pagination: {
              totalCount: number;
            };
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpinionReportReasons: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ReportReason"][];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpinionDetail2: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OpinionWithVote"];
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpinionAnalysis: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OpinionGroupRatio"][];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  opinionComments2: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 親意見のID */
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            opinions: components["schemas"]["OpinionWithVote"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  reportOpinion: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          reason: number | null;
          content: string | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpinionReports: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ReportDetail"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  solveOpinionReport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          action: components["schemas"]["ReportAction"];
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  vote2: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description 意見のID */
        opinionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          voteStatus: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Opinion"][];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  validateOrganizationCode: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        code: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            valid: boolean;
            organization?: components["schemas"]["Organization"];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOrganizations: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            organizations: components["schemas"]["Organization"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  establishOrganization: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          /** @description 組織名 */
          name: string;
          /** @description 組織コード（ログイン時に使用）
           *     4文字以上127文字以下の英数字 _- のみ使用可能 */
          code: string;
          /** @description 組織タイプ
           *     - 1: 通常（基本これ） */
          orgType: number;
          /**
           * Format: binary
           * @description 組織アイコン
           */
          icon?: Blob;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOrganizationAliases: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            aliases: components["schemas"]["OrganizationAlias"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  createOrganizationAlias: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          aliasName: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["OrganizationAlias"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  deleteOrganizationAlias: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        aliasID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  inviteOrganization: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          email: string;
          role: number;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  inviteOrganizationForUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          displayID: string;
          role: number;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            success: boolean;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  switchOrganization: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        code: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          /** @description SessionID */
          "Set-Cookie": string[];
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOrganizationUsers: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            users: components["schemas"]["OrganizationUser"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  updateOrganization: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        code: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          /** @description 組織名 */
          name: string;
          /**
           * Format: binary
           * @description 組織アイコン
           */
          icon?: Blob;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getPolicyConsentStatus: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["PolicyConsentStatus"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  policyConsent: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          policyVersion: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["PolicyConsentStatus"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  applyFeedbackToReport: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          reportID: string;
          feedbackType: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionList: {
    parameters: {
      query?: {
        /** @description ir
         *     1ページあたりの要素数 */
        limit?: number | null;
        /** @description どの要素から始めるか */
        offset?: number | null;
        theme?: string | null;
        status?: "open" | "finished";
        sortKey?: "latest" | "oldest" | "mostReplies" | "nearest";
        latitude?: number | null;
        longitude?: number | null;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            talkSessions: {
              talkSession: components["schemas"]["TalkSession"];
              opinionCount: number;
            }[];
            pagination: components["schemas"]["OffsetPagination"];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  initiateTalkSession: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          theme: string;
          /** Format: date-time */
          scheduledEndTime: string;
          latitude?: number;
          longitude?: number;
          city?: string;
          prefecture?: string;
          description?: string;
          thumbnailURL?: string;
          restrictions?: string[];
          aliasId?: string;
          hideTop?: boolean | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TalkSession"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  sessionsHistory: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
        /** @description テーマ */
        theme?: string | null;
        status?: "open" | "finished" | null;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            pagination: components["schemas"]["OffsetPagination"];
            talkSessions: {
              talkSession: components["schemas"]["TalkSession"];
              opinionCount: number;
            }[];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpenedTalkSession: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
        /** @description テーマ */
        theme?: string;
        status?: "finished" | "open" | null;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            talkSessions: {
              talkSession: components["schemas"]["TalkSession"];
              opinionCount: number;
            }[];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionRestrictionKeys: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Restriction"][];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionDetail: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TalkSession"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  editTalkSession: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          theme: string;
          /** Format: date-time */
          scheduledEndTime: string;
          latitude?: number;
          longitude?: number;
          prefecture?: string;
          city?: string;
          description?: string;
          thumbnailURL?: string;
          hideTop?: boolean | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TalkSession"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  talkSessionAnalysis: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            myPosition?: components["schemas"]["UserGroupPosition"];
            positions: components["schemas"]["UserGroupPosition"][];
            groupOpinions: {
              groupName: string;
              groupID: number;
              opinions: {
                opinion: components["schemas"]["Opinion"];
                user: components["schemas"]["User"];
                agreeCount: number;
                disagreeCount: number;
                passCount: number;
              }[];
            }[];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  getConclusion: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Conclusion"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  postConclusion: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          content: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Conclusion"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  hasConsent: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            hasConsent: boolean;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  consentTalkSession: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getOpinionsForTalkSession: {
    parameters: {
      query?: {
        sort?: "latest" | "mostReplies" | "oldest" | null;
        limit?: number | null;
        offset?: number | null;
        seed?: boolean | null;
      };
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            opinions: components["schemas"]["OpinionWithReplyAndVote"][];
            pagination: {
              totalCount: number;
            };
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionReport: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            report?: string | null;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getReportsForTalkSession: {
    parameters: {
      query?: {
        status?: "unsolved" | "deleted" | "hold";
      };
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            reports: components["schemas"]["ReportDetail"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionReportCount: {
    parameters: {
      query: {
        status: "unsolved" | "deleted" | "hold";
      };
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            count: number;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionRestrictionSatisfied: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["Restriction"][];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  swipeOpinions: {
    parameters: {
      query?: {
        limit?: number;
      };
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            opinions: components["schemas"]["OpinionWithReplyCount"][];
            remainingCount: number;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  postTimeLineItem: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          content: string;
          status: string;
          parentActionItemID?: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            actionItemID: string;
            sequence: number;
            content: string;
            status: string;
            createdAt: string;
            updatedAt: string;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTimeLine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            items: components["schemas"]["ActionItem"][];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  editTimeLine: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
        actionItemID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          content: string | null;
          status: string | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ActionItem"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  test: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            optInt?: number | null;
            optNilInt?: number;
            optNilBool?: boolean | null;
            optBool?: boolean;
            /** Format: uri */
            optUrl?: string;
            /** Format: url */
            optNilUrl?: string | null;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  dummyInit: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          integerNull: number | null;
          numericOptionalNull?: number | null;
          numericNull: number | null;
          numericOptional?: number;
          numeric: number;
          booleanOptionalNull?: boolean | null;
          booleanNull: boolean | null;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getUserInfo: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            user: components["schemas"]["User"];
            demographics: components["schemas"]["UserDemographics"];
            email?: string | null;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  updateUserProfile: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          displayName?: string;
          /** Format: binary */
          icon?: Blob;
          deleteIcon?: boolean | null;
          dateOfBirth: number | null;
          gender?: string;
          city?: string;
          prefecture?: string;
          email?: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  establishUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        "multipart/form-data": {
          displayName: string;
          displayID: string;
          /** Format: binary */
          icon?: Blob;
          dateOfBirth?: number;
          gender?: string;
          prefecture?: string;
          city?: string;
          email?: string;
        };
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  withdrawUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            message: string;
            /** Format: date-time */
            withdrawalDate: string;
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Access is unauthorized. */
      401: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
    };
  };
  getUserByDisplayID: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        displayID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      /** @description The server cannot find the requested resource. */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            code: string;
            message: string;
          };
        };
      };
      /** @description Server error */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getUserTalkSessions: {
    parameters: {
      query?: {
        limit?: number;
        offset?: number;
        status?: "finished" | "open" | null;
      };
      header?: never;
      path: {
        displayID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": {
            talkSessions: {
              talkSession: components["schemas"]["TalkSession"];
              opinionCount: number;
            }[];
            pagination: components["schemas"]["OffsetPagination"];
          };
        };
      };
      /** @description The server could not understand the request due to invalid syntax. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  getTalkSessionListManage: {
    parameters: {
      query?: {
        status?: "active" | "inactive";
        offset?: number;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TalkSessionListResponse"];
        };
      };
    };
  };
  getTalkSessionManage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["TalkSessionForManage"];
        };
      };
    };
  };
  manageRegenerateManage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/x-www-form-urlencoded": components["schemas"]["RegenerateRequest"];
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["RegenerateResponse"];
        };
      };
    };
  };
  getAnalysisReportManage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["AnalysisReportResponse"];
        };
      };
    };
  };
  toggleReportVisibilityManage: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        talkSessionID: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        "application/x-www-form-urlencoded": components["schemas"]["ToggleReportVisibilityRequest"];
      };
    };
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["ToggleReportVisibilityResponse"];
        };
      };
    };
  };
  getUserListManage: {
    parameters: {
      query?: {
        offset?: number;
        limit?: number;
        search?: string;
        orderBy?: "createdAt" | "updatedAt" | "displayName" | "lastLoginAt";
        order?: "asc" | "desc";
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["UserForManage"][];
        };
      };
    };
  };
  getUserStatsListManage: {
    parameters: {
      query: {
        range: string;
        offset?: number;
        limit?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["UserStatsResponse"][];
        };
      };
    };
  };
  getUserStatsTotalManage: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The request has succeeded. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          "application/json": components["schemas"]["UserStatsResponse"];
        };
      };
    };
  };
}
