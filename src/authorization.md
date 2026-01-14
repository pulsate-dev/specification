# アクセス制御について

## アカウントのロール

ロールはアカウントに対する権限の集合を示すものである.\
複数のロールを持つことはできず、1つのアカウントに対して1つのロールが設定される.\\
以下にロールの種類を示す．

### Admin (管理者)

管理者.\
他のロールを持つアカウントの状態を変更することができる．

### Moderator (モデレーター)

モデレーター.\
一般ロールのアカウントの状態を変更することができる．

### Normal (一般)

通常のユーザー.\
自分のリソースに対する操作のみを行うことが可能.

## メールアドレス検証状態

メールアドレスの検証が行われたかを示すもの.

### NotActivated (メールアドレス未検証)

メールアドレスの検証が行われていない状態.\
アカウント作成直後はこの状態になり，アカウントにログインすることはできない．

### Active (メールアドレス検証済み)

メールアドレスの検証が行われたことを示す状態.
設定されているロールの権限に基づく全ての操作が実行可能になる.

## アカウント状態

アカウントの現在の状態を示すもの.

### Notmal(通常)

通常の状態.\
設定されているロール権限に基づく全ての操作が実行可能.

> [!IMPORTANT]
>
> ただし、メールアドレス検証状態が`notActivated`である場合はそちらが優先される

### Frozen(凍結済み)

凍結済み状態.\
ログインを含む全ての操作が**実行不可能**.\
そのアカウントの投稿,
メディアは`Admin`/`Moderator`ロール以外のアカウントから閲覧できなくなる.

> [!IMPORTANT]
>
> 凍結状態が解除(解凍)された場合は、投稿やメディアは他のアカウントから閲覧可能になる.

### Silenced(サイレンス済み)

サイレンス済み状態.\
そのアカウントは新規投稿の公開範囲で`PUBLIC`を選択できなくなる

> [!IMPORTANT]
>
> サイレンス状態が解除されても、サイレンス中に行われた投稿の公開範囲は変更されない.

## アクセス制御表

### 凡例

操作が可能であれば`Yes`,
不可能であれば`No`と表記する．他人のリソースに対する操作が可能な場合は`Yes*`と表記する\
`-`は該当しない場合を示す．\
特殊な制御がある場合は具体的に記述する．\

- `Status:*` メールアドレスの検証状態
- `Role:*` アカウントのロール
- `Frozen:*` アカウントの状態
- `Not Signed in` ログインしていない状態

|        操作        | Status:Active | Status:NotActivated | Role:Normal | Role:Moderator | Role:Admin | Frozen:Frozen | Not Signed in | 備考 |
| :----------------: | :-----------: | :-----------------: | :---------: | :------------: | :--------: | :-----------: | :-----------: | :--: |
| Note::Create(投稿) |      Yes      |         No          |     Yes     |      Yes       |    Yes     |      No       |               |      |

### Account

|           操作           | Status:Active | Status:NotActivated | Role:Normal |          Role:Moderator           |             Role:Admin             | Frozen:Frozen |                        Not Signed in                         | 備考 |
| :----------------------: | :-----------: | :-----------------: | :---------: | :-------------------------------: | :--------------------------------: | :-----------: | :----------------------------------------------------------: | :--: |
|    Account::Register     |       -       |          -          |      -      |                 -                 |                 -                  |       -       | Yes(登録が解放されている場合) No(登録が解放されていない場合) |      |
|      Account::Edit       |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|     Account::Freeze      |      No       |         No          |     No      | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|    Account::Unfreeze     |      No       |         No          |     No      | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|      Account::Fetch      |      Yes      |         Yes         |     Yes     |                Yes                |                Yes                 |      No       |                             Yes                              |      |
|     Account::Silence     |      No       |         No          |     No      | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|   Account::UndoSilence   |      No       |         No          |     No      | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|     Account::Follow      |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
|    Account::Unfollow     |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
| Account::FetchFollowings |      Yes      |         Yes         |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
| Account::FetchFollowers  |      Yes      |         Yes         |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
|    Account::SetAvatar    |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
|    Account::SetHeader    |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |                              No                              |      |
|   Account::UnsetAvatar   |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |
|   Account::UnsetHeader   |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |                              No                              |      |

### Note

|       操作       | Status:Active | Status:NotActivated | Role:Normal |          Role:Moderator           |             Role:Admin             | Frozen:Frozen | Not Signed in | 備考 |
| :--------------: | :-----------: | :-----------------: | :---------: | :-------------------------------: | :--------------------------------: | :-----------: | :-----------: | :--: |
|   Note::Create   |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|   Note::Fetch    |      Yes      |         Yes         |     Yes     |                Yes                |                Yes                 |      No       |      Yes      |      |
|   Note::Renote   |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|   Note::Delete   |      Yes      |         Yes         |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
| Bookmark::Create |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
| Bookmark::Fetch  |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
| Bookmark::Delete |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
| Reaction::Create |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
| Reaction::Fetch  |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      Yes      |      |
| Reaction::Delete |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |

備考:
Bookmark::Fetch/Deleteはモデレーション処理を行う必要性が薄いためモデレーションの対象外とした．

### Drive/Medium

|       操作        | Status:Active | Status:NotActivated | Role:Normal |          Role:Moderator           |             Role:Admin             | Frozen:Frozen | Not Signed in | 備考 |
| :---------------: | :-----------: | :-----------------: | :---------: | :-------------------------------: | :--------------------------------: | :-----------: | :-----------: | :--: |
|  Medium::Upload   |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
| Medium::FetchList |      Yes      |         Yes         |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|   Medium::Fetch   |      Yes      |         Yes         |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|  Medium::Delete   |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |

### Timeline/List

|              操作               | Status:Active | Status:NotActivated | Role:Normal |          Role:Moderator           |             Role:Admin             | Frozen:Frozen | Not Signed in | 備考 |
| :-----------------------------: | :-----------: | :-----------------: | :---------: | :-------------------------------: | :--------------------------------: | :-----------: | :-----------: | :--: |
|       Timeline::FetchHome       |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|     Timeline::FetchAccount      |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|       Timeline::FetchList       |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|      Timeline::CreateList       |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|           List::Edit            |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|          List::Delete           |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
|       List::AssignMember        |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|      List::UnassignMember       |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|       List::FetchMembers        |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |
| Timeline::FetchConversationList |      Yes      |         No          |     Yes     |                Yes                |                Yes                 |      No       |      No       |      |
|   Timeline::FetchConversation   |      Yes      |         No          |     Yes     | Yes*(Role:Normalなアカウントのみ) | Yes*(Role:Admin**以外**に実行可能) |      No       |      No       |      |

### Notification

|              操作               | Status:Active | Status:NotActivated | Role:Normal | Role:Moderator | Role:Admin | Frozen:Frozen | Not Signed in | 備考 |
| :-----------------------------: | :-----------: | :-----------------: | :---------: | :------------: | :--------: | :-----------: | :-----------: | :--: |
| Notification::FetchNotification |      Yes      |         No          |     Yes     |      Yes       |    Yes     |      No       |      No       |      |
|    Notification::MarkAsRead     |      Yes      |         No          |     Yes     |      Yes       |    Yes     |      No       |      No       |      |
