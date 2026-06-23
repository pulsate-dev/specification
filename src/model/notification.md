# Notification モジュール

## `Announcement` (お知らせ)

インスタンス管理者がユーザー全体に向けて発信するメッセージ．

TypeScript 上ではお知らせ固有の ID 型を次のように定義する．

```typescript
export type AnnouncementID = ID<Announcement>;
```

`Announcement` は次の属性を持つ．

- **`id`**：AnnouncementID
- **`title`**：タイトル
- **`description`**：本文
- **`type`**：`AnnouncementKind`（後述）
- **`createdAt`**：作成日時
- **`updatedAt`**：最終更新日時（省略可）
- **`unread`**：未読フラグ

## `AnnouncementKind` (お知らせの種類)

- **`info`**：一般的なお知らせ
- **`warn`**：ユーザー全体への警告

## `Notification` (通知)

特定のアカウントに向けて発生する通知．

TypeScript 上では通知固有の ID 型を次のように定義する．

```typescript
export type NotificationID = ID<Notification>;
```

`Notification` は次の属性を持つ．

- **`id`**：NotificationID
- **`type`**：`NotificationKind`（後述）
- **`actor`**：`NotificationActor`（後述）
- **`createdAt`**：通知発生日時
- **`noteId`**：対象ノートの Snowflake ID
  - `mentioned`，`renoted`，`reacted` のときのみ存在する
- **`content`**：関連テキスト
  - `renoted` ではリノート元ノートの本文（CW 設定時は空文字列），`reacted`
    ではリアクション絵文字
  - `renoted` および `reacted` のときのみ存在する

## `NotificationKind` (通知の種類)

- **`followed`**：フォローされた
- **`followRequested`**：フォローをリクエストされた
- **`followAccepted`**：自分のフォローリクエストが承認された
- **`mentioned`**：メンションされた
- **`renoted`**：リノートされた
- **`reacted`**：リアクションされた

## `NotificationActor` (通知の発生源)

通知を発生させた主体を表す判別共用体．

- **`account`**：アカウントによる操作（ボットを含む）
  - **`id`**：AccountID
  - **`name`**：AccountName
  - **`nickname`**：表示名
  - **`avatar`**：アバター画像の URL
- **`system`**：システムによる通知（モデレーター警告など）
  - 詳細は未定義
