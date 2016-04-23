アクション周りのデータ要件を整理しました。

# アクションに関する要件

1. 星をTap =>モーダルが出る

2. アクションをする
    - 戦争してる感じ
    - hack => 相手の陣地だと攻撃できる。自分の陣地だと守りを強化できる。
    - 星っぽいアクション

3.星を確保できる => 確保したら星の色が変わる

# サーバ・クライアント共通のモデル

## star

- id
- name (`${name} - ` (nameが存在する場合) + `HIP: ${hip}`)
- constellation_id ( `description` 生成に使う外部キー/スクレイピングのロジック内で完結するならカラムは不要)
- description (`${constellation.name} を構成する星の1つです`)
- lon
- lat

緯度経度は 10進法 `135.6733223` を利用

## constellation

- id
- name

description生成用データ（スクレイピングのロジック内で完結するならテーブルは不要）

## team

- id
- name

チームは `0:Not(White)`, `1:Earth(Blue)`, `2:Alien(Red)` の3つを想定。道などをGREENで表示。
`0` を明記しているのはシステム都合で万が一必要になったときの予防策。

```
フロントでは定数扱い。DBでstarやscoreを管理するために使う。
```

## Score

- id
- star_id
- count

星はいずれかのチームに属する（ `count` が `-1` 以下であれば宇宙人のエリア、 `0` 以上であれば人間のエリア）。
チームの合計スコアは `count <= -1` と `count >= 0 ` で絞り込んで（宇宙人側は `-1` を乗算して）sum。

# フロントのアクション

下記WebAPIのIFと連動する。

## Main画面の描画

- 星を描画
    - lon/latで現在値を指定 => 一定範囲で取得する
    - team_idで色を指定する
- 戦況を掲示
    - teamのscoreの合計
- クライアント：30秒ごとに再描画
    - サーバサイド：データは1分

## 星をタップ

- starの各カラムを表示
    - name, description, score
    - team_idに応じて色を変える

## Hack

Must要件（処理）

- scoreを変更（自分のteam_idなら++, 相手のteam_idなら--）
- 画面を再描画（Mainと同じ処理）

Want要件（エフェクト）

- なんか攻撃している！感を描画
- starのteam_idが変わったら変わったぞ！感を描画

# WebAPIのIF

- RESTfulではなく画面描画のために1コールで呼べるIFとする
- 上記の `Model` のデータ仕様、`アクション` の動作を想定しています

## /main

### リクエスト

- get
    - lon
    - lat

※サーバサイド：絞り込む範囲は後で数字をいじれるようにしてほしいっす（TODO: 画面を見ながら最終調整）

### レスポンス

- response (オブジェクト)
    - stars (配列) > star (オブジェクト)
        - id
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして値を判定して絞り込む)
    - scores (オブジェクト)
        - blue_score (`score >= 0` で絞り込んだscoreの合算)
        - red_score (score < 0で絞り込んだscoreの合算)

## /star

### リクエスト

- get
    - id

### レスポンス

- response (オブジェクト)
    - star (オブジェクト)
        - id
        - name
        - description
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして値で判定して絞り込む)

## /hack

### リクエスト

- post
    - team_id
    - star_id
    - lon
    - lat

### レスポンス

- response (オブジェクト)
    - change (このPOSTで所有チームが変更したかどうか true/false で返す)
    - stars (配列) > star (オブジェクト)
        - id
        - lon
        - lat
        - team_id (所有チーム: scoreとjoinして値で判定して絞り込む)
    - scores (オブジェクト)
        - blue_score (team_idで絞り込んだscoreの合算)
        - red_score (team_idで絞り込んだscoreの合算)

change以外はmainと同じレスポンス（再描画に使う）
