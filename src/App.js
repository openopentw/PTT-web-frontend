import React, {Component} from 'react'
import {Snackbar, Slide} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {colors} from '@material-ui/core'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import {Helmet} from "react-helmet"
import {BrowserRouter as Router, Switch, Route, Redirect, useRouteMatch} from "react-router-dom"

import palette from './themes/palette.js'
import EinkPalette from './themes/eink_palette.js'
import typography from './themes/typography.js'

// apis
import Api from './apis/PyApi.js'
import Vars from './vars/Vars.js'

// components
import About from './components/About.js'
import Bar from './components/Bar.js'
import Board from './components/Board.js'
import Fabs from './components/Fabs.js'
import Favorite from './components/Favorite.js'
import Login from './components/Login.js'
import Post from './components/Post.js'

import './App.css'

const defaultTheme = createMuiTheme({
  palette,
  typography,
})

const einkTheme = createMuiTheme({
  EinkPalette,
  typography,
})

class App extends Component {
  vars = Vars

  state = {
    theme: this.vars.theme.default,
    // overlay top & first_in
    favTop: {
      top: 0,
      in: false,
    },
    boardTop: {
      top: 0,
      in: -1,
    },
    postTop: {
      top: 0,
      in: -1,
    },
    // snackbar
    showSnack: true,
    // login
    user: '',
    pass: '',
    isLogin: false,
    prevDis: null,
    // data - board
    boardList: [{board: 'NTU', type: '台大', title: '[臺大] (o・▽・o) 來發廢文嘛～'},
                {board: 'NTUcourse', type: '台大', title: '台大課程板 NTUCourse'}],
    boardI: 0,
    boardFetching: false,
    // data - post
    postList: [
      {
        "aid": "1V1mX5Kr",
        "author": "Barefoot24 (アドル)",
        "board": "MobileComm",
        "content": "\n\n目前XZ1拿兩年多\n\n因為裝 Netflix App 會當機 讓我有點想換\n\n之前有看上日亞X1 但因為台星好像不OK\n\n加上還是比較喜歡X1ii外型 所以最後在出貨前退了\n\n\n\n最近回頭找找X1ii的優惠\n\n記得之前有說搭振興券的方案(?) 但我一個也沒找到 (只找到電視有優惠)\n\n加上預購禮也都沒了\n\n現在這時點買是不是就單純的盤子而已...?\n\n--",
        "date": "Thu Jul  9 20:06:27 2020",
        "delete_status": 0,
        "index": 130149,
        "ip": "118.161.135.33",
        "is_control_code": false,
        "is_lock": false,
        "is_unconfirmed": false,
        "list_date": "7/09",
        "location": "臺灣",
        "money": 62,
        "origin_post": " 作者  Barefoot24 (アドル)                                   看板  MobileComm \n 標題  [問題] 現在買 Xperia 1 ii 很盤嗎?                                      \n 時間  Thu Jul  9 20:06:27 2020                                               \n───────────────────────────────────────\n\n\n目前XZ1拿兩年多\n\n因為裝 Netflix App 會當機 讓我有點想換\n\n之前有看上日亞X1 但因為台星好像不OK\n\n加上還是比較喜歡X1ii外型 所以最後在出貨前退了\n\n\n\n最近回頭找找X1ii的優惠\n\n記得之前有說搭振興券的方案(?) 但我一個也沒找到 (只找到電視有優惠)\n\n加上預購禮也都沒了\n\n現在這時點買是不是就單純的盤子而已...?\n\n--\n※ 發信站: 批踢踢實業坊(ptt.cc), 來自: 118.161.135.33 (臺灣)\n※ 文章網址: https://www.ptt.cc/bbs/MobileComm/M.1594296389.A.535.html\n推 marunaru    : 買28k的就還好 買電信的就盤                        07/09 20:06\n我好像在哪有看到那篇 但不是熟悉的電商平台 不太敢用\n推 ayuhb       : 你覺得貴就盤，覺得不貴就賺                        07/09 20:08\n→ ayuhb       : 不喜歡的人賣10元都覺得盤                          07/09 20:08\n可能是 晚入手又少給東西 相對剝奪感QQ 振興券也沒優惠\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 20:14:57\n推 wern05      : 通訊行都能買到28k了，這支好像還有一些小問題待修   07/09 20:22\n→ wern05      : 正，現在買原價真的上好美盤無誤                    07/09 20:22\n原來28k是指通訊行 也許我可以考慮看看 不過優惠好像比較亂\n推 NickXiang   : 買了 關掉比價網站 專心爽用就好                    07/09 20:23\n推 AJizzInPants: 爽就好 管其他人                                   07/09 20:25\n→ ex250203    : 坐等25K                                           07/09 20:32\n推 xperiaxz1   : 通訊行低於30K的可以買，原廠價很盤                 07/09 20:45\n推 biggood20708: 公務電話續約1399只要16K爽用                       07/09 20:47\n推 justin332805: Sony原價=上好美盤                                 07/09 20:47\n→ justin332805: 建議如果很急著買就找通訊行                        07/09 20:48\n本來是想說手上有百貨禮券加上振興券也有1萬初 考慮去Sony直營店買\n但從通訊行的價格看起來 去直營店買只是把禮券送給Sony而已...\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 20:55:39\n推 lisa0109    : 我昨天才把z5換成XZ1...XD                          07/09 20:50\n推 chenszhanx  : 我原價預購的，能有我盤么                          07/09 20:52\n→ chenszhanx  : 但是爽就好                                        07/09 20:53\n我懂 但是我現在捏不下去XDD 一方面還有其他3C想買\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 21:01:56\n→ n74042300   : 買索尼本來就盤 不分時間 電視手機都是              07/09 21:01\n推 jhangyu     : 等22k吧，4個月內會到                              07/09 21:08\n推 leo10       : 早買早享受阿                                      07/09 21:12\n推 j1300000    : 隔壁板全新27000就有了                             07/09 21:15\n推 rickie1141  : 夏天就買暖暖包太早了吧！                          07/09 21:18\n→ Pritfuss    : 感覺可以再等耶                                    07/09 21:19\n推 python35    : 好多雲用戶                                        07/09 21:25\n→ happy1712   : miko 28k                                          07/09 21:35\n推 maiklover   : XZP拿三年 直接原價買X1ii 爽就好 永遠都有更低價    07/09 21:41\n→ maiklover   : 不過認真建議等爆ping修好再買                      07/09 21:41\n推 peng198968  : X1定價30990，目前市價約20K，也就是上市一年跳10    07/09 22:04\n→ peng198968  : K左右。所以X1 II上市一年差不多是25K，不可能4個    07/09 22:04\n→ peng198968  : 月就跳到22K，4個月能低於30K就很多了。             07/09 22:04\n推 peng198968  : 如果原Po想買這支但覺得太貴就等跳水到符合自己的    07/09 22:07\n→ peng198968  : 預算再買吧。                                      07/09 22:07\n推 dome        : 日亞的X1是12000以內哦^^                           07/09 22:12\n對 不到1萬2\n噓 rz759       : 自己覺得值得就好                                  07/09 22:19\n→ sampohbk    : 自己覺得OK就好，管其它人幹嘛？                    07/09 22:21\n只是好奇 在預購禮結束~降價前這段期間 買的人多不多 還有這段時間太約多長\n推 torahiko    : 之前有人說一年剩3折啊XD                           07/09 22:23\n推 sam355322   : 1399續約15k 首年-200 再扣舊機回收 還行            07/09 22:30\n你們都辦那麼高的資費喔==\n推 omyg0d2007  : 28XXX~28999 見過的價                              07/09 22:32\n推 cook321     : 喜歡就買被，手機也沒多少錢                        07/09 22:34\n也是 而且可以用好幾年 下一版搞不好外型又走鐘 我大概會去通訊行問問看\n推 peng198968  : 如果有我想買的新機上市我會等上市3個月後再入手，   07/09 22:38\n→ peng198968  : 因為3個月手機的硬體有什麼問題也差不多都出來了，   07/09 22:40\n→ peng198968  : 如果價格覺得太貴就等跳水到符合自己的預算就入手。  07/09 22:42\n其實有保固我是覺得都還好 畢竟就買Sony的也不太挑其他家了\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 22:59:05\n推 gve50714    : 到底為什麼手機要買到那麼貴...體驗又沒升級多少     07/09 23:03\n推 sam355322   : 5g 1399才有吃到飽 沒吃到飽就當盤子了              07/09 23:03\n推 ciplu       : 再等一下  應該可以降到26000以下                   07/09 23:06",
        "pass_format_check": true,
        "push_list": [
          {
            "author": "marunaru",
            "content": "買28k的就還好 買電信的就盤",
            "ip": null,
            "time": "07/09 20:06",
            "type": 1
          },
          {
            "author": "ayuhb",
            "content": "你覺得貴就盤，覺得不貴就賺",
            "ip": null,
            "time": "07/09 20:08",
            "type": 1
          },
          {
            "author": "ayuhb",
            "content": "不喜歡的人賣10元都覺得盤",
            "ip": null,
            "time": "07/09 20:08",
            "type": 3
          },
          {
            "author": "wern05",
            "content": "通訊行都能買到28k了，這支好像還有一些小問題待修",
            "ip": null,
            "time": "07/09 20:22",
            "type": 1
          },
          {
            "author": "wern05",
            "content": "正，現在買原價真的上好美盤無誤",
            "ip": null,
            "time": "07/09 20:22",
            "type": 3
          },
          {
            "author": "NickXiang",
            "content": "買了 關掉比價網站 專心爽用就好",
            "ip": null,
            "time": "07/09 20:23",
            "type": 1
          },
          {
            "author": "AJizzInPants",
            "content": "爽就好 管其他人",
            "ip": null,
            "time": "07/09 20:25",
            "type": 1
          },
          {
            "author": "ex250203",
            "content": "坐等25K",
            "ip": null,
            "time": "07/09 20:32",
            "type": 3
          },
          {
            "author": "xperiaxz1",
            "content": "通訊行低於30K的可以買，原廠價很盤",
            "ip": null,
            "time": "07/09 20:45",
            "type": 1
          },
          {
            "author": "biggood20708",
            "content": "公務電話續約1399只要16K爽用",
            "ip": null,
            "time": "07/09 20:47",
            "type": 1
          },
          {
            "author": "justin332805",
            "content": "Sony原價=上好美盤",
            "ip": null,
            "time": "07/09 20:47",
            "type": 1
          },
          {
            "author": "justin332805",
            "content": "建議如果很急著買就找通訊行",
            "ip": null,
            "time": "07/09 20:48",
            "type": 3
          },
          {
            "author": "lisa0109",
            "content": "我昨天才把z5換成XZ1...XD",
            "ip": null,
            "time": "07/09 20:50",
            "type": 1
          },
          {
            "author": "chenszhanx",
            "content": "我原價預購的，能有我盤么",
            "ip": null,
            "time": "07/09 20:52",
            "type": 1
          },
          {
            "author": "chenszhanx",
            "content": "但是爽就好",
            "ip": null,
            "time": "07/09 20:53",
            "type": 3
          },
          {
            "author": "n74042300",
            "content": "買索尼本來就盤 不分時間 電視手機都是",
            "ip": null,
            "time": "07/09 21:01",
            "type": 3
          },
          {
            "author": "jhangyu",
            "content": "等22k吧，4個月內會到",
            "ip": null,
            "time": "07/09 21:08",
            "type": 1
          },
          {
            "author": "leo10",
            "content": "早買早享受阿",
            "ip": null,
            "time": "07/09 21:12",
            "type": 1
          },
          {
            "author": "j1300000",
            "content": "隔壁板全新27000就有了",
            "ip": null,
            "time": "07/09 21:15",
            "type": 1
          },
          {
            "author": "rickie1141",
            "content": "夏天就買暖暖包太早了吧！",
            "ip": null,
            "time": "07/09 21:18",
            "type": 1
          },
          {
            "author": "Pritfuss",
            "content": "感覺可以再等耶",
            "ip": null,
            "time": "07/09 21:19",
            "type": 3
          },
          {
            "author": "python35",
            "content": "好多雲用戶",
            "ip": null,
            "time": "07/09 21:25",
            "type": 1
          },
          {
            "author": "happy1712",
            "content": "miko 28k",
            "ip": null,
            "time": "07/09 21:35",
            "type": 3
          },
          {
            "author": "maiklover",
            "content": "XZP拿三年 直接原價買X1ii 爽就好 永遠都有更低價",
            "ip": null,
            "time": "07/09 21:41",
            "type": 1
          },
          {
            "author": "maiklover",
            "content": "不過認真建議等爆ping修好再買",
            "ip": null,
            "time": "07/09 21:41",
            "type": 3
          },
          {
            "author": "peng198968",
            "content": "X1定價30990，目前市價約20K，也就是上市一年跳10",
            "ip": null,
            "time": "07/09 22:04",
            "type": 1
          },
          {
            "author": "peng198968",
            "content": "K左右。所以X1 II上市一年差不多是25K，不可能4個",
            "ip": null,
            "time": "07/09 22:04",
            "type": 3
          },
          {
            "author": "peng198968",
            "content": "月就跳到22K，4個月能低於30K就很多了。",
            "ip": null,
            "time": "07/09 22:04",
            "type": 3
          },
          {
            "author": "peng198968",
            "content": "如果原Po想買這支但覺得太貴就等跳水到符合自己的",
            "ip": null,
            "time": "07/09 22:07",
            "type": 1
          },
          {
            "author": "peng198968",
            "content": "預算再買吧。",
            "ip": null,
            "time": "07/09 22:07",
            "type": 3
          },
          {
            "author": "dome",
            "content": "日亞的X1是12000以內哦^^",
            "ip": null,
            "time": "07/09 22:12",
            "type": 1
          },
          {
            "author": "rz759",
            "content": "自己覺得值得就好",
            "ip": null,
            "time": "07/09 22:19",
            "type": 2
          },
          {
            "author": "sampohbk",
            "content": "自己覺得OK就好，管其它人幹嘛？",
            "ip": null,
            "time": "07/09 22:21",
            "type": 3
          },
          {
            "author": "torahiko",
            "content": "之前有人說一年剩3折啊XD",
            "ip": null,
            "time": "07/09 22:23",
            "type": 1
          },
          {
            "author": "sam355322",
            "content": "1399續約15k 首年-200 再扣舊機回收 還行",
            "ip": null,
            "time": "07/09 22:30",
            "type": 1
          },
          {
            "author": "omyg0d2007",
            "content": "28XXX~28999 見過的價",
            "ip": null,
            "time": "07/09 22:32",
            "type": 1
          },
          {
            "author": "cook321",
            "content": "喜歡就買被，手機也沒多少錢",
            "ip": null,
            "time": "07/09 22:34",
            "type": 1
          },
          {
            "author": "peng198968",
            "content": "如果有我想買的新機上市我會等上市3個月後再入手，",
            "ip": null,
            "time": "07/09 22:38",
            "type": 1
          },
          {
            "author": "peng198968",
            "content": "因為3個月手機的硬體有什麼問題也差不多都出來了，",
            "ip": null,
            "time": "07/09 22:40",
            "type": 3
          },
          {
            "author": "peng198968",
            "content": "如果價格覺得太貴就等跳水到符合自己的預算就入手。",
            "ip": null,
            "time": "07/09 22:42",
            "type": 3
          },
          {
            "author": "gve50714",
            "content": "到底為什麼手機要買到那麼貴...體驗又沒升級多少",
            "ip": null,
            "time": "07/09 23:03",
            "type": 1
          },
          {
            "author": "sam355322",
            "content": "5g 1399才有吃到飽 沒吃到飽就當盤子了",
            "ip": null,
            "time": "07/09 23:03",
            "type": 1
          },
          {
            "author": "ciplu",
            "content": "再等一下  應該可以降到26000以下",
            "ip": null,
            "time": "07/09 23:06",
            "type": 1
          }
        ],
        "push_number": 26,
        "title": "[問題] 現在買 Xperia 1 ii 很盤嗎?",
        "web_url": "https://www.ptt.cc/bbs/MobileComm/M.1594296389.A.535.html"
      },
      {aid: 1, push_number: 21, date: '7/07', author: 'YJC', title:'嗨 測試一下1'},
      {aid: 2, push_number: 13, date: '7/07', author: 'YJC', title:'嗨 測試一下2'}
    ],
    postI: 0,
    post: {
      "aid": "1V1mX5Kr",
      "author": "Barefoot24 (アドル)",
      "board": "MobileComm",
      "content": "\n\n目前XZ1拿兩年多\n\n因為裝 Netflix App 會當機 讓我有點想換\n\n之前有看上日亞X1 但因為台星好像不OK\n\n加上還是比較喜歡X1ii外型 所以最後在出貨前退了\n\n\n\n最近回頭找找X1ii的優惠\n\n記得之前有說搭振興券的方案(?) 但我一個也沒找到 (只找到電視有優惠)\n\n加上預購禮也都沒了\n\n現在這時點買是不是就單純的盤子而已...?\n\n--",
      "date": "Thu Jul  9 20:06:27 2020",
      "delete_status": 0,
      "index": 130149,
      "ip": "118.161.135.33",
      "is_control_code": false,
      "is_lock": false,
      "is_unconfirmed": false,
      "list_date": "7/09",
      "location": "臺灣",
      "money": 62,
      "origin_post": " 作者  Barefoot24 (アドル)                                   看板  MobileComm \n 標題  [問題] 現在買 Xperia 1 ii 很盤嗎?                                      \n 時間  Thu Jul  9 20:06:27 2020                                               \n───────────────────────────────────────\n\n\n目前XZ1拿兩年多\n\n因為裝 Netflix App 會當機 讓我有點想換\n\n之前有看上日亞X1 但因為台星好像不OK\n\n加上還是比較喜歡X1ii外型 所以最後在出貨前退了\n\n\n\n最近回頭找找X1ii的優惠\n\n記得之前有說搭振興券的方案(?) 但我一個也沒找到 (只找到電視有優惠)\n\n加上預購禮也都沒了\n\n現在這時點買是不是就單純的盤子而已...?\n\n--\n※ 發信站: 批踢踢實業坊(ptt.cc), 來自: 118.161.135.33 (臺灣)\n※ 文章網址: https://www.ptt.cc/bbs/MobileComm/M.1594296389.A.535.html\n推 marunaru    : 買28k的就還好 買電信的就盤                        07/09 20:06\n我好像在哪有看到那篇 但不是熟悉的電商平台 不太敢用\n推 ayuhb       : 你覺得貴就盤，覺得不貴就賺                        07/09 20:08\n→ ayuhb       : 不喜歡的人賣10元都覺得盤                          07/09 20:08\n可能是 晚入手又少給東西 相對剝奪感QQ 振興券也沒優惠\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 20:14:57\n推 wern05      : 通訊行都能買到28k了，這支好像還有一些小問題待修   07/09 20:22\n→ wern05      : 正，現在買原價真的上好美盤無誤                    07/09 20:22\n原來28k是指通訊行 也許我可以考慮看看 不過優惠好像比較亂\n推 NickXiang   : 買了 關掉比價網站 專心爽用就好                    07/09 20:23\n推 AJizzInPants: 爽就好 管其他人                                   07/09 20:25\n→ ex250203    : 坐等25K                                           07/09 20:32\n推 xperiaxz1   : 通訊行低於30K的可以買，原廠價很盤                 07/09 20:45\n推 biggood20708: 公務電話續約1399只要16K爽用                       07/09 20:47\n推 justin332805: Sony原價=上好美盤                                 07/09 20:47\n→ justin332805: 建議如果很急著買就找通訊行                        07/09 20:48\n本來是想說手上有百貨禮券加上振興券也有1萬初 考慮去Sony直營店買\n但從通訊行的價格看起來 去直營店買只是把禮券送給Sony而已...\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 20:55:39\n推 lisa0109    : 我昨天才把z5換成XZ1...XD                          07/09 20:50\n推 chenszhanx  : 我原價預購的，能有我盤么                          07/09 20:52\n→ chenszhanx  : 但是爽就好                                        07/09 20:53\n我懂 但是我現在捏不下去XDD 一方面還有其他3C想買\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 21:01:56\n→ n74042300   : 買索尼本來就盤 不分時間 電視手機都是              07/09 21:01\n推 jhangyu     : 等22k吧，4個月內會到                              07/09 21:08\n推 leo10       : 早買早享受阿                                      07/09 21:12\n推 j1300000    : 隔壁板全新27000就有了                             07/09 21:15\n推 rickie1141  : 夏天就買暖暖包太早了吧！                          07/09 21:18\n→ Pritfuss    : 感覺可以再等耶                                    07/09 21:19\n推 python35    : 好多雲用戶                                        07/09 21:25\n→ happy1712   : miko 28k                                          07/09 21:35\n推 maiklover   : XZP拿三年 直接原價買X1ii 爽就好 永遠都有更低價    07/09 21:41\n→ maiklover   : 不過認真建議等爆ping修好再買                      07/09 21:41\n推 peng198968  : X1定價30990，目前市價約20K，也就是上市一年跳10    07/09 22:04\n→ peng198968  : K左右。所以X1 II上市一年差不多是25K，不可能4個    07/09 22:04\n→ peng198968  : 月就跳到22K，4個月能低於30K就很多了。             07/09 22:04\n推 peng198968  : 如果原Po想買這支但覺得太貴就等跳水到符合自己的    07/09 22:07\n→ peng198968  : 預算再買吧。                                      07/09 22:07\n推 dome        : 日亞的X1是12000以內哦^^                           07/09 22:12\n對 不到1萬2\n噓 rz759       : 自己覺得值得就好                                  07/09 22:19\n→ sampohbk    : 自己覺得OK就好，管其它人幹嘛？                    07/09 22:21\n只是好奇 在預購禮結束~降價前這段期間 買的人多不多 還有這段時間太約多長\n推 torahiko    : 之前有人說一年剩3折啊XD                           07/09 22:23\n推 sam355322   : 1399續約15k 首年-200 再扣舊機回收 還行            07/09 22:30\n你們都辦那麼高的資費喔==\n推 omyg0d2007  : 28XXX~28999 見過的價                              07/09 22:32\n推 cook321     : 喜歡就買被，手機也沒多少錢                        07/09 22:34\n也是 而且可以用好幾年 下一版搞不好外型又走鐘 我大概會去通訊行問問看\n推 peng198968  : 如果有我想買的新機上市我會等上市3個月後再入手，   07/09 22:38\n→ peng198968  : 因為3個月手機的硬體有什麼問題也差不多都出來了，   07/09 22:40\n→ peng198968  : 如果價格覺得太貴就等跳水到符合自己的預算就入手。  07/09 22:42\n其實有保固我是覺得都還好 畢竟就買Sony的也不太挑其他家了\n※ 編輯: Barefoot24 (118.161.135.33 臺灣), 07/09/2020 22:59:05\n推 gve50714    : 到底為什麼手機要買到那麼貴...體驗又沒升級多少     07/09 23:03\n推 sam355322   : 5g 1399才有吃到飽 沒吃到飽就當盤子了              07/09 23:03\n推 ciplu       : 再等一下  應該可以降到26000以下                   07/09 23:06",
      "pass_format_check": true,
      "push_list": [
        {
          "author": "marunaru",
          "content": "買28k的就還好 買電信的就盤",
          "ip": null,
          "time": "07/09 20:06",
          "type": 1
        },
        {
          "author": "ayuhb",
          "content": "你覺得貴就盤，覺得不貴就賺",
          "ip": null,
          "time": "07/09 20:08",
          "type": 1
        },
        {
          "author": "ayuhb",
          "content": "不喜歡的人賣10元都覺得盤",
          "ip": null,
          "time": "07/09 20:08",
          "type": 3
        },
        {
          "author": "wern05",
          "content": "通訊行都能買到28k了，這支好像還有一些小問題待修",
          "ip": null,
          "time": "07/09 20:22",
          "type": 1
        },
        {
          "author": "wern05",
          "content": "正，現在買原價真的上好美盤無誤",
          "ip": null,
          "time": "07/09 20:22",
          "type": 3
        },
        {
          "author": "NickXiang",
          "content": "買了 關掉比價網站 專心爽用就好",
          "ip": null,
          "time": "07/09 20:23",
          "type": 1
        },
        {
          "author": "AJizzInPants",
          "content": "爽就好 管其他人",
          "ip": null,
          "time": "07/09 20:25",
          "type": 1
        },
        {
          "author": "ex250203",
          "content": "坐等25K",
          "ip": null,
          "time": "07/09 20:32",
          "type": 3
        },
        {
          "author": "xperiaxz1",
          "content": "通訊行低於30K的可以買，原廠價很盤",
          "ip": null,
          "time": "07/09 20:45",
          "type": 1
        },
        {
          "author": "biggood20708",
          "content": "公務電話續約1399只要16K爽用",
          "ip": null,
          "time": "07/09 20:47",
          "type": 1
        },
        {
          "author": "justin332805",
          "content": "Sony原價=上好美盤",
          "ip": null,
          "time": "07/09 20:47",
          "type": 1
        },
        {
          "author": "justin332805",
          "content": "建議如果很急著買就找通訊行",
          "ip": null,
          "time": "07/09 20:48",
          "type": 3
        },
        {
          "author": "lisa0109",
          "content": "我昨天才把z5換成XZ1...XD",
          "ip": null,
          "time": "07/09 20:50",
          "type": 1
        },
        {
          "author": "chenszhanx",
          "content": "我原價預購的，能有我盤么",
          "ip": null,
          "time": "07/09 20:52",
          "type": 1
        },
        {
          "author": "chenszhanx",
          "content": "但是爽就好",
          "ip": null,
          "time": "07/09 20:53",
          "type": 3
        },
        {
          "author": "n74042300",
          "content": "買索尼本來就盤 不分時間 電視手機都是",
          "ip": null,
          "time": "07/09 21:01",
          "type": 3
        },
        {
          "author": "jhangyu",
          "content": "等22k吧，4個月內會到",
          "ip": null,
          "time": "07/09 21:08",
          "type": 1
        },
        {
          "author": "leo10",
          "content": "早買早享受阿",
          "ip": null,
          "time": "07/09 21:12",
          "type": 1
        },
        {
          "author": "j1300000",
          "content": "隔壁板全新27000就有了",
          "ip": null,
          "time": "07/09 21:15",
          "type": 1
        },
        {
          "author": "rickie1141",
          "content": "夏天就買暖暖包太早了吧！",
          "ip": null,
          "time": "07/09 21:18",
          "type": 1
        },
        {
          "author": "Pritfuss",
          "content": "感覺可以再等耶",
          "ip": null,
          "time": "07/09 21:19",
          "type": 3
        },
        {
          "author": "python35",
          "content": "好多雲用戶",
          "ip": null,
          "time": "07/09 21:25",
          "type": 1
        },
        {
          "author": "happy1712",
          "content": "miko 28k",
          "ip": null,
          "time": "07/09 21:35",
          "type": 3
        },
        {
          "author": "maiklover",
          "content": "XZP拿三年 直接原價買X1ii 爽就好 永遠都有更低價",
          "ip": null,
          "time": "07/09 21:41",
          "type": 1
        },
        {
          "author": "maiklover",
          "content": "不過認真建議等爆ping修好再買",
          "ip": null,
          "time": "07/09 21:41",
          "type": 3
        },
        {
          "author": "peng198968",
          "content": "X1定價30990，目前市價約20K，也就是上市一年跳10",
          "ip": null,
          "time": "07/09 22:04",
          "type": 1
        },
        {
          "author": "peng198968",
          "content": "K左右。所以X1 II上市一年差不多是25K，不可能4個",
          "ip": null,
          "time": "07/09 22:04",
          "type": 3
        },
        {
          "author": "peng198968",
          "content": "月就跳到22K，4個月能低於30K就很多了。",
          "ip": null,
          "time": "07/09 22:04",
          "type": 3
        },
        {
          "author": "peng198968",
          "content": "如果原Po想買這支但覺得太貴就等跳水到符合自己的",
          "ip": null,
          "time": "07/09 22:07",
          "type": 1
        },
        {
          "author": "peng198968",
          "content": "預算再買吧。",
          "ip": null,
          "time": "07/09 22:07",
          "type": 3
        },
        {
          "author": "dome",
          "content": "日亞的X1是12000以內哦^^",
          "ip": null,
          "time": "07/09 22:12",
          "type": 1
        },
        {
          "author": "rz759",
          "content": "自己覺得值得就好",
          "ip": null,
          "time": "07/09 22:19",
          "type": 2
        },
        {
          "author": "sampohbk",
          "content": "自己覺得OK就好，管其它人幹嘛？",
          "ip": null,
          "time": "07/09 22:21",
          "type": 3
        },
        {
          "author": "torahiko",
          "content": "之前有人說一年剩3折啊XD",
          "ip": null,
          "time": "07/09 22:23",
          "type": 1
        },
        {
          "author": "sam355322",
          "content": "1399續約15k 首年-200 再扣舊機回收 還行",
          "ip": null,
          "time": "07/09 22:30",
          "type": 1
        },
        {
          "author": "omyg0d2007",
          "content": "28XXX~28999 見過的價",
          "ip": null,
          "time": "07/09 22:32",
          "type": 1
        },
        {
          "author": "cook321",
          "content": "喜歡就買被，手機也沒多少錢",
          "ip": null,
          "time": "07/09 22:34",
          "type": 1
        },
        {
          "author": "peng198968",
          "content": "如果有我想買的新機上市我會等上市3個月後再入手，",
          "ip": null,
          "time": "07/09 22:38",
          "type": 1
        },
        {
          "author": "peng198968",
          "content": "因為3個月手機的硬體有什麼問題也差不多都出來了，",
          "ip": null,
          "time": "07/09 22:40",
          "type": 3
        },
        {
          "author": "peng198968",
          "content": "如果價格覺得太貴就等跳水到符合自己的預算就入手。",
          "ip": null,
          "time": "07/09 22:42",
          "type": 3
        },
        {
          "author": "gve50714",
          "content": "到底為什麼手機要買到那麼貴...體驗又沒升級多少",
          "ip": null,
          "time": "07/09 23:03",
          "type": 1
        },
        {
          "author": "sam355322",
          "content": "5g 1399才有吃到飽 沒吃到飽就當盤子了",
          "ip": null,
          "time": "07/09 23:03",
          "type": 1
        },
        {
          "author": "ciplu",
          "content": "再等一下  應該可以降到26000以下",
          "ip": null,
          "time": "07/09 23:06",
          "type": 1
        }
      ],
      "push_number": 26,
      "title": "[問題] 現在買 Xperia 1 ii 很盤嗎?",
      "web_url": "https://www.ptt.cc/bbs/MobileComm/M.1594296389.A.535.html"
    },
  }

  api = new Api()

  // input change

  handleInputChange = (n, v) => {
    this.setState({[n]: v})
  }

  // login / logout

  handleLogin = async () => {
    const con = await this.api.login(this.state.user, this.state.pass)
    console.log(con)
    if (con.status) {
      this.setState({
        isLogin: con.status,
      })
    }
  }

  handleLogout = async () => {
    const isLogout = await this.api.logout()
    if (isLogout.status) {
      this.setState({isLogin: false})
    }
  }

  // fetch & index change

  fetchFav = async () => {
    const con = await this.api.getFavBoard()
    if (con.status.status) {
      this.setState({
        boardList: con.data.fav_b,
      })
    }
  }

  handleBoardIChange = (boardI) => {
    this.setState({boardI})
  }

  fetchBoard = async (board) => {
    const con = await this.api.getPosts(board)
    if (con.status.status) {
      this.setState({
        postList: con.data.posts,
        postI: 0,
        boardFetching: false,
      })
    }
  }

  handleBoardMore = async () => {
    await this.setState({boardFetching: true})
    const {boardList, boardI, postList} = this.state
    const endI = postList.length
    const endIdx = postList[endI - 1].index - 1
    const con = await this.api.getPosts(boardList[boardI].board, endIdx)
    if (con.status.status) {
      let newPostList = con.data.posts
      let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
      const oldToEnd = elm.scrollHeight - elm.scrollTop
      await this.setState({
        postList: postList.concat(newPostList),
      })
      elm.scrollTop = elm.scrollHeight - oldToEnd
      this.setState({boardFetching: false})
    }
  }

  handlePostIChange = (postI) => {
    this.setState({postI})
  }

  fetchPost = async (aid) => {
    const {boardI, boardList, postList, postI} = this.state
    // const con = await this.api.getPost(boardList[boardI].board, postList[postI].aid)
    const con = await this.api.getPost(boardList[boardI].board, aid)
    if (con.status.status) {
      this.setState({
        post: con.data.post,
      })
    }
  }

  // update tops

  updateTop = async (overlay) => {
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    if (overlay === Vars.overlay.initial) {
      await this.setState({favTop: {
        top: elm.scrollTop,
        in: true,
      }})
    } else if (overlay === Vars.overlay.board) {
      await this.setState({boardTop: {
        top: elm.scrollTop,
        in: this.state.boardList[this.state.boardI].board,
      }})
    } else { // post
      await this.setState({postTop: {
        top: elm.scrollTop,
        in: this.state.postList[this.state.postI].aid,
      }})
    }
  }

  // componentDidMount

  async componentDidMount() {
    if (navigator.userAgent.includes('Kobo eReader')) {
      this.setState({theme: Vars.theme.eink})
    }
    // if logged in before
    const con = await this.api.checkLogin()
    if (con.status) {
      this.setState({
        isLogin: true,
        user: con.user,
      })
    }
    // prevent disconnect from ptt
    this.preventDisconnect()
  }

  preventDisconnect = () => {
    let prevDis = setInterval(() => {
      if (this.state.isLogin) {
        console.log('Sending prevent disconnect messages ...')
        this.api.preventDisconnect()
      }
    }, 40000)
    this.setState({prevDis})
  }

  componentWillUnmount() {
    clearInterval(this.state.prevDis)
  }

  render() {
    const {postI, boardFetching, boardList, boardI, postList, post} = this.state
    const {vars} = this
    return (
      <ThemeProvider theme={this.state.theme === Vars.theme.eink? einkTheme : defaultTheme}>
        <Router>
          <Helmet>
            <style>
              {`body {
                background-color: ${this.state.theme === Vars.theme.eink? 'white': colors.grey[300]};
              }`}
            </style>
          </Helmet>
          <Bar
            theme={this.state.theme}
            isLogin={this.state.isLogin}
            post={postList[postI]}
            boardName={boardList[boardI].board}
            handleLogout={this.handleLogout}
          />
          {this.state.isLogin? (
            <Switch>
              <Route path="/bbs">
                <Bbs
                  theme={this.state.theme}
                  boardList={boardList}
                  boardI={boardI}
                  fetchFav={this.fetchFav}
                  favTop={this.state.favTop}
                  updateTop={this.updateTop}
                  handleBoardIChange={this.handleBoardIChange}
                  postList={postList}
                  postI={postI}
                  boardFetching={boardFetching}
                  boardTop={this.state.boardTop}
                  fetchBoard={this.fetchBoard}
                  handleBoardMore={this.handleBoardMore}
                  handlePostIChange={this.handlePostIChange}
                  fetchPost={this.fetchPost}
                  post={this.state.post}
                  postTop={this.state.postTop}
                />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/login">
                <Redirect to="/bbs" />
              </Route>
              <Route exact path="/">
                <Redirect to="/bbs" />
              </Route>
            </Switch>
          ) : (
            <Switch>
              <Route path="/login">
                <Login
                  theme={this.state.theme}
                  handleInputChange={this.handleInputChange}
                  handleLogin={this.handleLogin}
                />
              </Route>
              <Route path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          )}
          {this.state.theme === Vars.theme.eink? (
            <Fabs
            />
          ) : null}
            {/*<Snackbar
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={this.state.showSnack}
            onClose={() => {this.setState({showSnack: false})}}
            autoHideDuration={6000}
            TransitionComponent={(props) => <Slide {...props} direction="up" />}
          >
            <Alert severity="info">AAA</Alert>
          </Snackbar>*/}
        </Router>
      </ThemeProvider>
    )
  }
}

const Bbs = (props) => {
  let match = useRouteMatch()
  return (
    <div>
      <Switch>
        <Route exact path={match.path}>
          <Favorite
            theme={props.theme}
            fetchFav={props.fetchFav}
            boardList={props.boardList}
            boardI={props.boardI}
            favTop={props.favTop}
            updateTop={props.updateTop}
            handleBoardIChange={props.handleBoardIChange}
          />
        </Route>
        <Route path={`${match.path}/:board`}>
          <BoardPost
            theme={props.theme}
            postList={props.postList}
            postI={props.postI}
            boardFetching={props.boardFetching}
            boardI={props.boardI}
            boardTop={props.boardTop}
            updateTop={props.updateTop}
            fetchBoard={props.fetchBoard}
            handleBoardMore={props.handleBoardMore}
            handlePostIChange={props.handlePostIChange}
            fetchPost={props.fetchPost}
            post={props.post}
            postTop={props.postTop}
          />
        </Route>
      </Switch>
    </div>
  )
}

const BoardPost = (props) => {
  let match = useRouteMatch()
  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:aid`}>
          <Post
            theme={props.theme}
            post={props.post}
            fetchPost={props.fetchPost}
            postTop={props.postTop}
            updateTop={props.updateTop}
          />
        </Route>
        <Route exact path={match.path}>
          <Board
            theme={props.theme}
            postList={props.postList}
            postI={props.postI}
            boardFetching={props.boardFetching}
            boardI={props.boardI}
            boardTop={props.boardTop}
            updateTop={props.updateTop}
            fetchBoard={props.fetchBoard}
            handleBoardMore={props.handleBoardMore}
            handlePostIChange={props.handlePostIChange}
          />
        </Route>
      </Switch>
    </div>
  )
}

export default App
