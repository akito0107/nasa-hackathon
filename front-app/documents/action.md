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
- blue_score
- red_score
- team_id

```
* 緯度経度は 10進法 135.6733223 を利用
* チームの合計スコアを求めるときは、全レコードの blue_score/red_score の値を合計する
* score は以下を満たすものとする
  * Team テーブルと同期する
    * blue_score を update するとき、team.score (team.id = 1) も同じように update
    * red_score を update するとき、team.score (team.id = 2) も同じように update
  * team = 1 (Earth/Blue) が Hack して update するとき,
    * red_score > 0 であれば red_score を -1
    * red_score <= 0 であれば blue_score を +1 (更新前が red_score == 0 && blue_score == 0 だったら team_id = 1 に update)
  * team = 2 (Alien/Red) が Hack して update するとき,
    * blue_score > 0 であれば blue_score を -1
    * blue_score <= 0 であれば red_score を +1 (更新前が red_score == 0 && blue_score == 0 だったら team_id = 2 に update)
  * 基本的に相手のスコアがあったらそれを減らす。相手のスコアがなければ自分のスコアを追加する。
```

## constellation

- id
- name

```
* description生成用データ（スクレイピングのロジック内で完結するならテーブルは不要）
```

## team

- id
- name
- color
- score

```
* チームは {0, Not, white}, {1, Earth, blue}, {2, Alien, red} の3つを想定。道などをGREENで表示。
  * 0 を明記しているのはシステム都合で万が一必要になったときの予防策。
* score（チームの持つスコア合計）の更新は Star テーブルの更新と同期を取る。
```



# フロントのアクション

下記WebAPIのIFと連動する。

## Main画面の描画

- 星を描画
    - lon/latで現在値を指定 => 一定範囲で取得する
    - team_idで色を指定する
- 戦況を掲示
    - teamのscoreの合計
- クライアント：30秒ごとに再描画
    - サーバサイド：データは60秒

## 星をタップ

- starの各カラムを表示
    - name, description, score
    - team_idに応じて色を変える

## Hack

Must要件（処理）

- scoreを変更（モデルの `star` を参照）
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
        - team_id
    - scores (オブジェクト)
        - blue_score
        - red_score

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
        - team_id

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
        - team_id
    - scores (オブジェクト)
        - blue_score
        - red_score

change以外はmainと同じレスポンス（再描画に使う）
