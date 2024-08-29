# 通知API

## お知らせ（Announce)の種類

| 種類コード |         説明         |
| :--------: | :------------------: |
|   `info`   |   一般的なお知らせ   |
|   `warn`   | ユーザー全体への警告 |

## 通知の種類 / `actor`の種類

通知の種類

## `followed` - フォローされた

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "followed",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `followRequested` - フォローをリクエストされた

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "followRequested",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `followAccepted` - (自分が行った)フォローが承認された

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "followAccepted",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `mentioned` - メンションされた

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "mentioned",
  // 言及元ノートID
  "noteId": "29847304533478",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `renoted` - リノートされた

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "renoted",
  // リノートされたノートID
  "noteId": "1032809844545437574",
  // 投稿本文(CW指定の場合は空になる)
  "content": "",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `reacted` - リアクションされた

取り得る`actor`の種類:

- `account`

```jsonc
{
  "id": "20923084093774",
  "type": "reacted",
  // リアクションされたノートのID
  "noteId": "3094320840856",
  // リアクションの内容
  "content": "🐭",
  "actor": {
    "type": "account",
    "account": {
      "id": "209384",
      "name": "@johndoe@example.com",
      "nickname": "John Doe🌤",
      "avatar": "https://cdn.example.com/johndoe/avater"
    }
  },
  "createdAt": "2024-08-01T00:00:00.000Z"
}
```

## `actor`について

通知を発生させた主体の種類

- `account`: (内部外部問わず) (ユーザー)アカウント
  - botの場合も含む
- `system`: システム通知
  - モデレーター等からの警告通知など

`account`:

```jsonc
{
  "type": "account",
  "account": {
    // アカウントID
    "id": "209384",
    // アカウント名
    "name": "@johndoe@example.com",
    // アカウントニックネーム
    "nickname": "John Doe🌤",
    // アバター画像のURL
    "avatar": "https://cdn.example.com/johndoe/avater"
  }
}
```

`system`:

```jsonc
{
  "type": "system",
  "system": {
  }
}
```

## `GET /notifications`

届いているすべての通知を取得します。すでに既読がついている通知は表示されません。

### 入力

なし

### 出力

- body: `application/json`

```jsonc
{
  // インスタンス全体へのお知らせ
  "announcements": [
    {
      "id": "308205359",
      "title": "Service maintenance",
      "description": "scheduled: 2024 Sep. 10 00:00 ~ 01:00(UTC)\nduring this period, all services will be unavailable.",
      // お知らせの種類
      "type": "info",
      "createdAt": "2024-08-01T00:00:00.000Z",
      // optional
      "updatedAt": "2024-08-01T10:00:00.000Z",
      // 既読か
      "unread": false
    }
  ],
  // 自分宛ての通知
  "notifications": [
    {
      "id": "20923084093774",
      "type": "followed",
      "actor": {
        "type": "account",
        "account": {
          "id": "209384",
          "name": "@johndoe@example.com",
          "nickname": "John Doe🌤",
          "avatar": "https://cdn.example.com/johndoe/avater"
        }
      },
      "createdAt": "2024-08-01T00:00:00.000Z"
    }
  ]
}
```

## `POST /notifications/{id}/read`

通知を既読にします

### 入力

- パスパラメータ
  - `id`: string
    - 既読にする通知ID

- body: `application/json`

```jsonc
{}
```

### 出力

**`204 No Content`** 通知を既読にしました。
