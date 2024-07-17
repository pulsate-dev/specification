# アカウントAPI

## `POST /accounts` ✓

新規アカウントを作成する
正確には登録中の状態のアカウントを作成し,アカウント登録スキームを開始するものである.

### 入力

body: `application/json`

| 項目名        | 型       | 制約/説明                                                                                             | 文字数制約        | 例                                          |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------- |
| name          | `string` | 文字は `A-Z` `a-z` `0-9` `-` `.` `_`である必要がある. 先頭,及び最後の文字は `A-Z a-z 0-9` のみとする. | 1 ≤ N ≤ 64 [文字] | `john` ※登録される情報は`@john@example.com` |
| email         | `string` | メールアドレスとして正しい形式 (メールアドレスを受信可能であるかは問わない)                           | 7≤N≤319[文字]     | `johndoe@example.com`                       |
| passphrase    | `string` | スペース,タブ,全角スペース,改行,ヌルを除くUTF-8文字列                                                 | 8≤N≤512[文字]     | `じゃすた・いぐざんぽぅ`, `just~@_examp1e!` |
| captcha_token | `string` | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) などの手動操作検証のトークン   |                   |                                             |

### 入力例

```json
{
  "name": "example",
  "email": "foo@example.com",
  "passphrase": "じゃすた・いぐざんぽぅ",
  "captcha_token": "hogehogehgoe"
}
```

### 出力

**`200 OK`**

```json
{
  "id": "38477395",
  "name": "example",
  "email": "foo@example.com"
}
```

body: `application/json`

| 項目名 | 型          | 説明                                                                        | 文字数        | 例                     |
| ------ | ----------- | --------------------------------------------------------------------------- | ------------- | ---------------------- |
| id     | `snowflake` | アカウントのID                                                              | -             | `30848577730000`       |
| name   | `string`    | ユーザー名                                                                  | 8≤N≤512[文字] | `@johndoe@example.com` |
| email  | `string`    | メールアドレスとして正しい形式 (メールアドレスを受信可能であるかは問わない) | 7≤N≤319[文字] | `john@example.com`     |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_ACCOUNT_NAME`:
  使用できない文字が含まれている,文字の使用制限に違反している
- `TOO_LONG_ACCOUNT_NAME`: アカウント名が長すぎる
- `EMAIL_IN_USE`: メールアドレスが既に使用されている
- `YOU_ARE_BOT`: captcha_token の検証に失敗した

**`409 Conflict`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NAME_IN_USE`: アカウント名が既に使用されている
- `EMAIL_IN_USE` : メールアドレスが既に使用されている

## `PATCH /accounts/{account_name}` ✓

アカウント情報を指定のパラメータで編集するエンドポイント.

入力の body から次の情報のいずれか 1
つ以上を受け付け、それらを同時に適用できるかを検証し,反映する.

競合を防ぐために「更新前のニックネームと更新前のメールアドレスを結合した文字列」のハッシュを
[ETag (Entity Tag)](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/ETag)
として用いる.

これをMD5でハッシュするものとする.

メールアドレスを更新した場合はそのメールアドレスの確認スキームが開始される.

そしてそのメールアドレスが確認されるまで,メールアドレスの更新処理は遅延される.

ニックネームも同時に更新した場合,ニックネームの更新は先に反映される.

> [!WARNING]
>
> ETag が一致しないときは 412 Precondition Failed のエラーとなる. 結合方法は
> `更新前のニックネーム:更新前のメールアドレス`である

### 入力

- body: `application/json`

| 項目名        | 型       | 制約/説明                                                                                             | 文字数制約        | 例                                                                                     |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| name          | `string` | 文字は `A-Z` `a-z` `0-9` `-` `.` `_`である必要がある. 先頭,及び最後の文字は `A-Z a-z 0-9` のみとする. | 1 ≤ N ≤ 64 [文字] | `john` ※登録される情報は`@john@example.com`                                            |
| email         | `string` | メールアドレスとして正しい形式 (メールアドレスを受信可能であるかは問わない)                           | 7≤N≤319[文字]     | `johndoe@example.com`                                                                  |
| passphrase    | `string` | スペース,タブ,全角スペース,改行,ヌルを除くUTF-8文字列                                                 | 8≤N≤512[文字]     | `じゃすた・いぐざんぽぅ`, `just~@_examp1e!`                                            |
| captcha_token | `string` | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) などの手動操作検証のトークン   |                   |                                                                                        |
| bio           | `string` | 自己紹介文. 0文字である場合は`null`や`undefined`ではなく空の文字列`""`である必要がある.               | 0≤N≤1024          | `""` (空文字列), `いい感じの自己紹介🆓`, `This is bio hello^~ <:javascript:358409384>` |

### 入力例

```json
{
  "nickname": "example",
  "email": "foo@example.com",
  "passphrase": "じゃすた・いぐざんぽぅ",
  "bio": "テストユーザーなのぜ"
}
```

### 出力

**`200 OK`**

編集に成功しました.

```json
{
  "id": "38477395",
  "name": "@john@example.com",
  "nickname": "John Doe",
  "bio": "テストユーザーなのぜ",
  "email": "foo@example.com"
}
```

| 項目名           | 型          | 説明                                                                        | 文字数        | 例                            |
| ---------------- | ----------- | --------------------------------------------------------------------------- | ------------- | ----------------------------- |
| id               | `snowflake` | アカウントのID                                                              | -             | `30848577730000`              |
| name             | `string`    | ユーザー名                                                                  | 8≤N≤512[文字] | `@johndoe@example.com`        |
| email            | `string`    | メールアドレスとして正しい形式 (メールアドレスを受信可能であるかは問わない) | 7≤N≤319[文字] | `john@example.com`            |
| nickname         | `string`    | 表示名,アカウントの表示に用いる短い文字列                                   | 1≤N≤256       | `JohnDoe<:json:299384730049>` |
| `ジョン・ドゥ🚉` |             |                                                                             |               |                               |

**`202 Accepted`**

メールアドレスが更新された場合

```json
{
  "id": "38477395",
  "name": "@john@example.com",
  "nickname": "John Doe",
  "bio": "テストユーザーなのぜ",
  "email": "foo@example.com"
}
```

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_SEQUENCE`: パラメータ内に使用不可能な文字種を含んでいる
- `VULNERABLE_PASSPHRASE`:
  新しいパスフレーズがパスフレーズとしての要件を満たしていない

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 名前が `account_name` のアカウントが見つからない

**`412 Precondition Failed`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_ETAG`: ETagが不正である

## `PUT /accounts/{account_name}/freeze` ✓

アカウントを凍結するエンドポイント.

モデレータ以上の権限を持つアカウント認証情報が必要である.

凍結されると以下のような挙動になる.

- ログインできなくなる.
  - ログインしようとするとエラー終了する.
- 投稿できなくなる.
- (公開APIを除く)いかなるAPIへの操作も受け付けなくなる.

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名
- body: `application/json`
  - 空のオブジェクトを送信せよ.
    - 空でない場合のメンバーは無視される.

### 入力例

```json
{}
```

### 出力

**`204 No Content`**

凍結が完了した.

※レスポンスボディは空になる.

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ALREADY_FROZEN`: すでに凍結済みである.

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NO_PERMISSION`: アカウントを凍結できる権限がない.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: アカウントが見つからない.

## `DELETE /accounts/{account_name}/freeze` ✓

アカウントを凍結解除する(解凍と表記することもある).

モデレータ以上の権限の持つアカウント認証情報が必要.

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名
- body: `application/json`
  - 空のオブジェクトを送信せよ.
    - 空でない場合のメンバは無視される.

### 入力例

```json
{}
```

### 出力

**`204 No Content`**

凍結解除した.

※レスポンスボディは空になる.

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NO_PERMISSION`: アカウントを凍結解除できる権限がない.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: アカウントが見つからない.

## `POST /accounts/{account_name}/resend_verify_email` ✓

メールアドレスの検証コードを再送

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名

body: `application/json`

| 項目名        | 型       | 制約/説明                              | 文字数 | 例 |
| ------------- | -------- | -------------------------------------- | ------ | -- |
| captcha_token | `string` | Cloudflare Trunstileなどの検証トークン |        |    |

### 入力例

```json
{
  "captcha_token": "hogehogehgoe"
}
```

### 出力

**`204 No Content`**

再送した

※レスポンスボディは空になる.

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_ALREADY_VERIFIED`: アカウントのメールアドレスはすでに検証されている.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: アカウントが見つからない

## `POST /accounts/{account_name}/verify_email` ✓

メールアドレス認証が終了していないアカウントに対して,

メールアドレスに送信された認証トークンを検証することでメールアドレス認証を行う.

処理が完了すると,検証済みアカウントになりログインなどの各種操作が行えるようになる(ToDo
行うことのできる操作の一覧へのリンク

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名
- body: `application/json`

| 項目名 | 型       | 制約/説明                                  | 文字数 | 例 |
| ------ | -------- | ------------------------------------------ | ------ | -- |
| token  | `string` | 認証トークン: [モデル](../model.md) を参照 |        |    |

### 入力例

```json
{
  "token": "vq34rvyanho10q9hbc98ydbvaervna43r0varhj"
}
```

### 出力

**`204 No Content`**

検証に成功

※ レスポンスボディは空になります

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_TOKEN`: トークンの検証に失敗.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない.

## `POST /login` ✓

ログインして認証/更新トークンを作成します.

> [!WARNING]
>
> 認証トークンの有効期限は15分(900秒),
> 更新トークンの有効期限は30日(2,592,000秒)である.
> どちらのトークンも,APIサーバーが再起動されると無効になり,その場合は再度ログインする必要がある.

### 入力

- body: `application/json`

| 項目名        | 型       | 制約/説明                              | 文字数        | 例                                          |
| ------------- | -------- | -------------------------------------- | ------------- | ------------------------------------------- |
| name          | `string` | アカウント名                           | 8≤N≤512[文字] | `@johndoe@example.com`                      |
| passphrase    | `string` | パスフレーズ                           | 8≤N≤512       | `じゃすた・いぐざんぽぅ`, `just~@_examp1e!` |
| captcha_token | `string` | Cloudflare Trunstileなどの検証トークン |               |                                             |

### 入力例

```json
{
  "name": "@john@example.com",
  "passphrase": "じゃすた・いぐざんぽぅ",
  "captcha_token": "hogehogehoge"
}
```

### 出力

**`200 OK`**

ログインしました

```json
{
  "authorization_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  eyJzdWIiOiIzZTE2NDQ4MzMwMDAwMDIiLCJpYXQiOjE2NDA5OTUyMDEsInJlZnJlc2hfdG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUl6WlRFMk5EUTR  Nek13TURBd01ESWlMQ0pwWVhRaU9qRTJOREE1T1RVeU1ERjkud2Q4cWJVcWowWGtCU1hud0FxM0lRYU1nQS1RTFd2MHVKU1NLX3BIVTZCYyJ9.mRUfLIYOGlLuC9D72zBriVvrHYrQgVHW7ntQ-bp5SHs",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  eyJzdWIiOiIzZTE2NDQ4MzMwMDAwMDIiLCJpYXQiOjE2NDA5OTUyMDEsInJlZnJlc2hfdG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUl6WlRFMk5EUTR  Nek13TURBd01ESWlMQ0pwWVhRaU9qRTJOREE1T1RVeU1ERjkud2Q4cWJVcWowWGtCU1hud0FxM0lRYU1nQS1RTFd2MHVKU1NLX3BIVTZCYyJ9.mRUfLIYOGlLuC9D72zBriVvrHYrQgVHW7ntQ-bp5SHs",
  "expires_in": 1672498800
}
```

| 項目名              | 型       | 制約/説明                                                           | 文字数 | 例 |
| ------------------- | -------- | ------------------------------------------------------------------- | ------ | -- |
| authorization_token | `string` | 認証トークン                                                        |        |    |
| refresh_token       | `string` | 更新トークン                                                        |        |    |
| expires_in          | `number` | 有効期限. Pulsate Epochからの秒数: [モデル](../model.md#id) を参照. |        |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `FAILED_TO_LOGIN`: パスフレーズかアカウント名が間違っている
- `YOU_ARE_BOT`: captchaトークンの検証に失敗

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_ARE_FROZEN`: ログインしようとしたアカウントは凍結されている

## `POST /refresh` ✓

更新トークンで認証トークンを再発行

### 入力

- body: `application/json`
  - `refresh_token`: `string`
    - 更新トークン

| 項目名        | 型       | 制約/説明                        | 文字数 | 例 |
| ------------- | -------- | -------------------------------- | ------ | -- |
| refresh_token | `string` | 更新トークン [参照](../model.md) |        |    |

### 入力例

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZTE2NDQ4MzMwMDAwMDIiLCJpYXQiOjE2NDA5OTUyMDEsInJlZnJlc2hfdG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUl6WlRFMk5EUTRNek13TURBd01ESWlMQ0pwWVhRaU9qRTJOREE1T1RVeU1ERjkud2Q4cWJVcWowWGtCU1hud0FxM0lRYU1nQS1RTFd2MHVKU1NLX3BIVTZCYyJ9.mRUfLIYOGlLuC9D72zBriVvrHYrQgVHW7ntQ-bp5SHs"
}
```

### 出力

**`200 OK`**

ログインに成功した

```json
{
  "authorization_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZTE2NDQ4MzMwMDAwMDIiLCJpYXQiOjE2NDA5OTUyMDEsInJlZnJlc2hfdG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUl6WlRFMk5EUTRNek13TURBd01ESWlMQ0pwWVhRaU9qRTJOREE1T1RVeU1ERjkud2Q4cWJVcWowWGtCU1hud0FxM0lRYU1nQS1RTFd2MHVKU1NLX3BIVTZCYyJ9.mRUfLIYOGlLuC9D72zBriVvrHYrQgVHW7ntQ-bp5SHs"
}
```

| 項目名                                                                    | 型       | 制約/説明    | 文字数 | 例 |
| ------------------------------------------------------------------------- | -------- | ------------ | ------ | -- |
| autorization_token                                                        | `string` | 認証トークン |        |    |
| [Untitled](https://www.notion.so/74411becb886427fb512a32d523d6faf) を参照 |          |              |        |    |

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `INVALID_TOKEN`: 更新トークンが不正
- `EXPIRED_TOKEN`: トークンの有効期限切れ

## `GET /accounts/{account_name}` ✓

アカウント情報を取得

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名

### 出力

**`200 OK`**

取得に成功

```json
{
  "id": "2874987398",
  "name": "@john@example.com",
  "nickname": "John Doe",
  "bio": "I am Test User.",
  "avatar": "https://example.com/images/avatar.png",
  "header": "https://example.com/images/header.png",
  "followed_count": 200,
  "following_count": 10,
  "note_count": 20000
}
```

| 項目名          | 型          | 制約/説明                                                                         | 文字数        | 例                                                                                    |
| --------------- | ----------- | --------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| id              | `snowflake` | アカウントID                                                                      |               | `2934002842`                                                                          |
| name            | `string`    | アカウント名                                                                      | 8≤N≤512[文字] | `@johndoe@example.com`                                                                |
| nickname        | `string`    | 表示名,アカウントの表示に用いる短い文字列                                         | 1≤N≤256       | `JohnDoe<:json:299384730049>`, `ジョン・ドゥ🚉`                                       |
| bio             | `string`    | 自己紹介文. 0文字である場合はnullやundefinedではなくからの文字列である必要がある. | 0≤N≤1024      | `""` (空文字列), `いい感じの自己紹介🆓`,`This is bio hello^~ <:javascript:358409384>` |
| avatar          | `string`    | アカウントのアイコン画像のURL                                                     |               |                                                                                       |
| header          | `string`    | アカウントのヘッダー画像のURL                                                     |               |                                                                                       |
| followed_count  | `number`    | そのアカウントをフォローしている人数                                              |               |                                                                                       |
| following_count | `number`    | そのアカウントがフォローしている人数                                              |               |                                                                                       |
| note_count      | `number`    | そのアカウントの投稿数                                                            |               |                                                                                       |

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない

## `PUT /accounts/{account_name}/silence` ✓

アカウントをサイレンスする.モデレータ以上の権限を持つアカウント認証情報が必要.

サイレンスされると以下のような挙動になる.

- 公開投稿(投稿範囲が`public`になる投稿)ができなくなる

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名
- body: `application/json`
  - ボディは空オブジェクトである必要がある.
  - 空でない場合,メンバは無視される.

### 入力例

```json
{}
```

### 出力

**`204 No Content`**

凍結に成功

※レスポンスボディは空になる.

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NO_PERMISSION`: アカウントをサイレンスできる権限がない.

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない.

## `DELETE /accounts/{account_name}/silence` ✓

アカウントをサイレンス解除

モデレータ以上の権限の持つアカウント認証情報が必要.

### 入力

- パスパラメータ
  - `account_name`: `string`
    - アカウント名
- body: `application/json`
  - オブジェクトは空である必要がある.
  - 空でない場合,メンバは無視される.

### 入力例

```json
{}
```

### 出力

**`204 No Content`**

サイレンスを解除

※レスポンスボディは空になる.

**`403 Forbidden`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `NO_PERMISSION`: アカウントをサイレンス解除できる権限がない

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない

## `POST /accounts/{account_name}/follow` ✓

指定したアカウントをフォロー

### 入力

- パスパラメータ
  - `account_name`: `string`
    - フォローしたいアカウント名
- body: `application/json`
  - 空オブジェクトを送信せよ
    - 空でない場合のメンバは無視される

### 入力例

```json
{}
```

### 出力

**`201 Accepted`**

フォローを受け付けた

```json
{
  "pending": true
}
```

- フォローする相手がフォローを手動承認制にしている場合はpendingがtrueになる.
  - フォローする相手がフォローを手動承認制にしていない場合もある.
    - この場合はpendingは必ず`false`になる.
- v2以降の予定:
  フォローする相手が同じインスタンスに所属していない場合はすべての場合でpendingがtrueになる.

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ALREADY_FOLLOWING`: アカウントをすでにフォローしている
- `YOU_ARE_BLOCKED`: 相手にブロックされている

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない.

## `DELETE /accounts/{account_name}/follow` ✓

フォローを解除します

### 入力

- パスパラメータ
  - `account_name`: `string`
    - フォロー解除したいアカウント名
- body: `application/json`
  - リクエストボディは空オブジェクトを送信せよ.
    - 空でない場合のメンバは無視される.

### 入力例

```json
{}
```

### 出力

**`204 No Content`**

フォローを解除した.

※レスポンスボディは空になる.

**`400 Bad Request`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `YOU_`ARE_NOT`_FOLLOW_ACCOUNT`: 指定したアカウントをフォローしていない

**`404 Not Found`**

```json
{
  "error": "TEST_ERROR_CODE"
}
```

- `ACCOUNT_NOT_FOUND`: 指定した名前のアカウントは存在しない
