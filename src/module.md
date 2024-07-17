# 内部フロー・モジュール間通信

![モジュール間通信を示す Mermaid ダイアグラム](./image/mermaid/module-mermaid.png)

<details>

<summary>Mermaid code</summary>

```mermaid
sequenceDiagram
autonumber
actor ユーザー

ユーザー ->> NoteModule: 投稿

opt ダイレクト投稿の場合
	NoteModule ->> AccountModule: 送信先アカウントの存在チェック
end

NoteModule ->> AccountModule: 投稿者情報取得

opt リノートの場合
	NoteModule ->> NoteModule: 引用 or リノート先情報取得
end

NoteModule ->> ユーザー: 投稿完了

NoteModule ->> SearchModule: 検索インデックス投入
NoteModule ->> TimelineModule: 投稿作成イベント発火
TimelineModule ->> AccountModule: フォロー関係情報取得
TimelineModule ->> NotificationModule:通知イベント発火
TimelineModule ->> ActivityPubModule: 投稿作成イベント発火
```

</details>

## モジュールの概要

### Note Module

- ノート(投稿)の作成を行う.
- ノートの削除を行う.
- ノート情報を返す.

### Account Module

- アカウント情報の管理を行う.
- アカウントを凍結/解除する.
- アカウントをサイレンスする.

### Timeline Module

- タイムラインを構築する.
  - 特定のアカウントが見ることのできる投稿をフォロー関係と公開範囲から決定する.
- (ActivityPub 外部配送 / Push通知)の送信先アカウントを決定する.

### Notification Module

- クライアントに対してPush通知・メール通知を送信する.

### ActivityPub Module

- ActivityPubを経由した外部サーバーへのノート配送を行う.
- ActivityPubを経由したノートの受信を行う.
