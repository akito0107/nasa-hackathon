

アクション周りのデータ要件を整理しました。

# アクションに関する要件
星をTap

1.モーダルが出る
モーダルに表示するもの

2.アクションをする
戦争してる感じ
hack => アイテムゲット
アイテムがないと攻撃できない。
相手の陣地だとアイテムゲットするとポイントが減る。
ゲーム性を高める仕組み
相手の陣地だと攻撃できる。自分の陣地だと守りを強化できる。
星っぽいアクション

3.星を確保できる
確保したら星の色が変わる
4.星座をコンプリートした場合にはさらにエフェクト

---

# サーバ・クライアント共通のモデル

> 実際にはリスト形式だったり計算・結合した形でIFしたいので別途調整させてください。


## star

- id
- name
- constellation_id （星座idを持つのは、星座の全部の星の数を洗い出せるようにするため）
- description （説明文はデータセットで用意できなそうなら、「XX星座の一部です」くらいでいいかも）
- lon
- lat
- team_id
- score

星はいずれかのチームに属する（相手のスコアを0にした上で攻撃すると取り返せる）

## constellation

- id
- name

星が集まって星座


## line

- id
- constellation_id
- star_a_id
- star_b_id

正確には星座を成す星の組み合わせで線を描画する必要がある


## team

- id
- name
- score （チームは合計スコアを保有（星座をすべて取るとボーナスポイントとか））

チームは `0:Not(White)`, `1:Earth(Blue)`, `2:Alien(Red)` の3つを想定。道などを緑で表示かな。


## user

- id
- team_id
- lon
- lat

どちらかのチームにユーザーは所属（最初はユーザー＝チームで1対1想定）

## hack
- user_id
- star_id
- count

ユーザーは星にHackする（回数制限あり:すべての星で一律同じ定数で扱う）


## item

- id
- name

Hackするとユーザーはアイテムを入手（最初は単純な防御・攻撃のアイテム1つだけ）


## stock

- user_id
- item_id
- count

アイテムの保有状況はstockとして管理

---

# フロントのアクション（最小要件）

- 描画
  - 戦況を掲示（teamのscore もしくは starのteam_idごとの数）
  - 星を描画（lon/latで位置を指定、team_idで色を指定）
    - 現在値から一定範囲で取得？だとしたら要Indexだけど。
  - 星座を描画（starA,starB,team_idで線を引く。starAとstarBのteam_idが同じときのみLineのteam_idがそいつになる）

- 星をタップ
  - starの各カラムを表示
    - name, description, scoreくらいかな
    - team_idに応じて色を変える
    - 画像も出したいけどデータがないかもなのでWant要件
  - Hackコマンド（user_id/star_idのhackオブジェクトのcountが上限に満たなければOK）
  - Itemコマンド（user_idのstockがあればOK）

- Hack
  - hackのcount++
  - stockのcount++ / itemゲット！描画

- Item
  - Must
    - stockのcount--
     - starのscoreを変更（自分のteam_idなら++, 相手のteam_idなら--）
    - teamのscoreを変更
  - Want
    - なんか攻撃している！感を描画
    - starのteam_idが変わったら変わったぞ！感を描画
    - 星座のLineのteam_idが変わったら変わったぞ！感を描画 + ボーナスScore?
    - 星座のLine全部のteam_idが自チームになったらスペシャル！感を描画 + ボーナスScore?

※テキストデータでかつ容量大きめになるようなら要zipか


## 18:30時点
* 残り時間から鑑みて、少しscopeから外しましょうということになったので検討しましょう
