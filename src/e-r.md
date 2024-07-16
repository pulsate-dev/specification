# ER図 (WIP)

![ER図](./image/mermaid/er-diagram.png)

<details>

<summary>Mermaid code</summary>

```mermaid
erDiagram
account {
  string id PK
  string name
	string nickname
	string mail
  string passphrase_hash
  string bio
  int role "権限"
  int status "アカウントの状態"
	datetime created_at
	datetime updated_at
	datetime deleted_at
}
account ||--o{ note : "has"
account ||--o{ list : "has"
account ||--o{ bookmark : "has"
account ||--o{ following : "has"
account ||--o{ medium : "hosts"
account ||--o{ reaction : "has"

following {
	string from FK
  string to FK
	int state "FOLLOWING/REQUESTING_FOLLOW/BLOCKINGの3値を取る"
	datetime created_at
	datetime updated_at
	datetime deleted_at
}


note {
  string id PK
  string text "投稿本文"
  string author_id FK "投稿者のID"
  int visibility "公開範囲"
	datetime created_at
	datetime deleted_at
}
note ||--o{ bookmark : "has"
note ||--o{ reaction : "has"

reaction {
  string reacted_by FK "リアクションしたユーザーID"
  string reacted_to FK "リアクションしたノートID"
  string body "内容(絵文字)"
	datetime created_at
	datetime deleted_at
}

bookmark {
  string note_id FK
  string author_id FK "ブックマークをしたユーザーID"
	datetime created_at
	datetime deleted_at
}

list {
  string id PK
  string title "リスト名"
  int visibility "公開するかどうか"
	datetime created_at
	datetime updated_at
	datetime deleted_at
}
list ||--o{ list_member : "has"

list_member {
  string list_id FK
  string member_id FK "メンバのアカウントID"
	datetime created_at
	datetime deleted_at
}
list_member }o--|| account : ""

medium {
  string id PK
  string name "ファイル名"
  string mime "mime type"
  string author_id FK
	datetime created_at
	datetime deleted_at
}

note_attachment {
	string medium_id FK
	string note_id FK
  string alt "altテキスト"
	datetime created_at
	datetime deleted_at
}
note_attachment }o--|| note: ""
note_attachment }o--|| medium: "references"
```
</details>

----

- 未定義リスト
  - リノートの扱い
    1. notesがrenoteに対してリレーションを持つようにする
    2. notesにrenote先のIDを持たせる
  - 登録中アカウント用のテーブルを作るか否か
  - アカウント(同士の)関係

> [!NOTE]
>
> ドライブが階層構造などを持たないという仕様になった上, 一旦これ以上は複雑化させない方針になっているのでメディアが直接アカウントに紐づく形になっています.

> [!IMPORTANT]
>
> CONSIDERATIONS:
>
> - [x] `note_attachements` との関連は多対多になるかも?
> - [ ] accounts に bookmarks が直接関連しているのは正しいのか?
