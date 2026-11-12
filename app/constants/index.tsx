export const GOOGLE_LOGIN_URL = `${API_URL}/auth/google/login?redirect_url=${APP_URL}/auth/signup`;
export const LINE_LOGIN_URL = `${API_URL}/auth/line/login?redirect_url=${APP_URL}/auth/signup`;

/**
 * 入室前アンケート機能を有効にするか。
 *
 * 現在は有効。無効化する場合は、既存アンケートとAPI側の
 * `survey.answered` restriction も合わせて無効化する必要がある。
 */
export const ENABLE_SURVEY = false;

/**
 * クエリパラメーターを受け取って別のページに飛ぶようにする
 * Googleログインの場合
 */
