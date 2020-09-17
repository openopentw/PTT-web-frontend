import React, {Component} from 'react'
import {Snackbar, Slide, Fade} from '@material-ui/core'
import {Alert, AlertTitle} from '@material-ui/lab'
import {colors} from '@material-ui/core'
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import {Helmet} from "react-helmet"
import {BrowserRouter as Router, Switch, Route, Redirect, useRouteMatch} from "react-router-dom"
import 'react-image-lightbox/style.css'

// thems
import palette from './themes/palette.js'
import EinkPalette from './themes/eink_palette.js'
import typography from './themes/typography.js'

// apis
import Api from './apis/PyApi.js'
import Vars from './vars/Vars.js'
import matchAll from './util/matchAll.js'
import FilterOptions from './util/FilterOptions.js'

// components
import About from './components/About.js'
import Bar from './components/Bar.js'
import Board from './components/Board.js'
import Fabs from './components/Fabs.js'
import Favorite from './components/Favorite.js'
import Search from './components/Search.js'
import Login from './components/Login.js'
import Post from './components/Post.js'
import NewPost from './components/NewPost.js'

import './App.css'

const defaultTheme = createMuiTheme({
  palette,
  typography,
})

const einkTheme = createMuiTheme({
  palette: EinkPalette,
  typography,
})

class App extends Component {
  state = {
    theme: Vars.theme.default,
    // snackbar
    showSnack: false,
    snackMsg: {
      severity: Vars.severity.info,
      msg: '',
      title: '',
      autoHideDuration: null,
    },
    // overlays
    overlay: Vars.overlay.initial,
    back: {
      title: '',
      url: '',
    },
    // overlay top & first_in
    favTop: {
      top: 0,
      in: false,
      boardI: 0,
    },
    boardTop: {
      top: 0,
      in: -1,
      postI: 0,
    },
    postTop: {
      top: 0,
      in: -1,
    },
    // process
    firstFetch: true,
    fetching: false,
    fetchingMore: false,
    fetchingSearch: false,
    // login
    user: '',
    pass: '',
    isLogin: false,
    prevDis: null,
    // search
    searchValue: '',
    // data - board
    allBoard: [],
    boardList: [],
    board: '',
    boardRangeBeg: 0,
    // data - post
    postList: [],
    post: {},
    postRangeBeg: 0,
  }

  api = new Api()

  // overlays

  updateOverlay = (overlay) => {
    this.setState({overlay})
  }

  updateBack = (back) => {
    this.setState({back})
  }

  updateBoard = (board) => {
    this.setState({board})
  }

  // snack bar

  showMsg = (severity, msg, autoHideDuration=4000) => {
    this.setState({
      showSnack: true,
      snackMsg: {severity, msg, autoHideDuration},
    })
  }

  // login / logout

  handleInputChange = (n, v) => {
    this.setState({[n]: v})
  }

  handleLogin = async (msg='登入中…') => {
    this.showMsg(Vars.severity.info, msg, null)
    const con = await this.api.login(this.state.user, this.state.pass)
    if (con.status) {
      this.showMsg(Vars.severity.success, `歡迎，${this.state.user}.`)
      await this.setState({
        isLogin: con.status,
      })
    } else {
      this.setState({isLogin: false})
      this.showMsg(Vars.severity.error, con.str)
    }
  }

  handleLogout = async () => {
    const con = await this.api.logout()
    if (con.status) {
      this.showMsg(Vars.severity.success, `再見，${this.state.user}.`)
      this.setState({isLogin: false})
    } else {
      this.showMsg(Vars.severity.error, con.str)
    }
  }

  // index change

  handleScroll = () => {
    let elm = this.state.theme === Vars.theme.eink? document.body : document.scrollingElement
    const browserHeight = document.documentElement.clientHeight
    const {overlay, fetching, fetchingMore, postList, boardRangeBeg, post, postRangeBeg} = this.state
    if (!fetching) {
      if (overlay === Vars.overlay.board) {

        // if (!fetchingMore && elm.scrollTop < 1024) {
        //   this.fetchBoardMore()
        // }

        // fetch more
        if (!fetchingMore
            && boardRangeBeg + 4 * Vars.boardRange > postList.length
            && postList[postList.length - 1].index > 1) {
          // console.log('Fetching more ...')
          this.fetchBoardMore()
        }

        // update top
        if (elm.scrollTop + 2 * browserHeight > document.body.clientHeight) { // append to bottom
          if (boardRangeBeg > 0) {
            // console.log('Scroll Up')
            this.setState(prevState => ({boardRangeBeg: Math.max(0, prevState.boardRangeBeg - Vars.boardRange)}))
          }
        } else if (elm.scrollTop < browserHeight) { // append to top
          const lastIdx = postList[Math.min(boardRangeBeg + 3 * Vars.boardRange, postList.length) - 1].index
          if (lastIdx > 1) {
            // console.log('Scroll Down')
            this.setState(prevState => ({boardRangeBeg: prevState.boardRangeBeg + Math.min(Vars.boardRange, lastIdx - 1)}))
          }
        }

      } else if (overlay === Vars.overlay.post) {

        if (elm.scrollTop + 2 * browserHeight > document.body.clientHeight) { // append to bottom
          if (postRangeBeg + 3 * Vars.postRange < post.processed.text.length) {
            if (postRangeBeg + 4 * Vars.postRange <= post.processed.text.length) {
              this.setState(prevState => ({postRangeBeg: prevState.postRangeBeg + Vars.postRange}))
            } else {
              this.setState(prevState => ({postRangeBeg: Math.max(0, post.processed.text.length - 3 * Vars.postRange)}))
            }
          }
        } else if (elm.scrollTop < browserHeight) { // append to top
          if (postRangeBeg > 0) {
            this.setState(prevState => ({postRangeBeg: Math.max(0, prevState.postRangeBeg - Vars.postRange)}))
          }
        }

      }
    }
  }

  resetPostRangeBeg = () => {
    this.setState({postRangeBeg: 0})
  }

  onSearchChange = (searchValue) => {
    this.setState({searchValue})
  }

  // fetch

  tryFetch = async (doFetch, ifFail=null) => {
    let retry = 0
    while (retry < Vars.number.retryMax && this.state.isLogin) {
      ++retry
      let res = await doFetch()
      if (res.status) {
        return true
      }
      this.showMsg(Vars.severity.error, res.str)
      if (this.state.user.length > 0) {
        await this.handleLogin('重新登入中…')
      }
    }
    this.setState({isLogin: false})
    if (ifFail !== null) {
      ifFail()
    }
    return false
  }

  fetchFav = async () => {
    this.setState({fetching: true})
    let res = await this.tryFetch(async () => {
      const con = await this.api.getFavBoard()
      if (con.status.status) {
        this.setState({
          boardList: con.data.b_list,
          fetching: false,
        })
        return {status: true}
      }
      return {status: false, str: con.status.str}
    }, () => {
      this.setState({fetching: false})
    })
  }

  filterOptions = null

  fetchAllBoard = async () => {
    this.setState({fetchingSearch: true})
    await this.tryFetch(async () => {
      const con = await this.api.getAllBoard()
      if (con.status.status) {
        const allBoard = con.data.b_list
        this.setState({
          allBoard,
          fetchingSearch: false,
        })
        this.filterOptions = new FilterOptions(allBoard, this.state.theme)
        return {status: true}
      }
      return {status: false, str: con.status.str}
    }, () => {
      this.setState({fetchingSearch: false})
    })
  }

  fetchBoard = async (board) => {
    this.setState({fetching: true, fetchingMore: true})
    await this.tryFetch(async () => {
      const con = await this.api.getPosts(board)
      if (con.status.status) {
        this.setState({
          postList: con.data.posts,
          boardRangeBeg: 0,
          fetching: false,
          fetchingMore: false,
        })
        return {status: true}
      }
      return {status: false, str: con.status.str}
    }, () => {
      this.setState({fetching: false, fetchingMore: false})
    })
  }

  fetchBoardMore = async () => {
    await this.setState({fetchingMore: true})
    await this.tryFetch(async () => {
      const {postList} = this.state
      const endIdx = postList[postList.length - 1].index - 1
      const con = await this.api.getPosts(this.state.board, endIdx)
      if (con.status.status) {
        this.setState(prevState => ({
          postList: prevState.postList.concat(con.data.posts),
          fetchingMore: false,
        }))
        return {status: true}
      }
      return {status: false, str: con.status.str}
    }, () => {
      this.setState({fetchingMore: true})
    })
  }

  findImg = (p) => {
    const reg = Vars.reg.img
    let img = [
      ...[...matchAll(reg.img, p)].map(url => url[0]),
      ...[...matchAll(reg.elseImgur, p)].map(url => `${url[0]}.jpg`),
    ]
    let modImg = []
    for (let i in img) {
      let m = img[i].match(reg.imgur)
      if (m !== null) {
        modImg.push([img[i], `${m[1]}h.${m[2]}`])
      } else {
        modImg.push([img[i]])
      }
    }
    return modImg
  }

  processPost = (post) => {
    if (!post) {
      return {}
    } else {
      // classify text and find imgs
      const types = Vars.postTextType
      const reg = Vars.reg
      let text = []
      let imgArr = []

      let ps = post.split('\n')
      let findDel = false
      let pushCnt = 0
      for (let i in ps) {
        const p = ps[i]
        if (!p) {
          text.push({p: p, type: types.empty})
        } else if ((i < 4 && p[1] === '作' && p[2] === '者') // is header
                   || (i < 4 && p[1] === '標' && p[2] === '題')
                   || (i < 4 && p[1] === '時' && p[2] === '間')
                   || (i < 4 && p[1] === '─' && p[2] === '─')) {
          text.push({p: p, type: types.header})
        } else if (reg.text.isSys.test(p)) {
          if (!findDel && reg.text.isDel.test(p)) {
            findDel = true
            pushCnt = 0
            text.push({
              p: p,
              type: types.del
            })
          } else {
            text.push({
              p: p,
              type: types.sys
            })
          }
        } else if (reg.text.isPush.test(p)) {
          let ip = reg.text.push.ip.exec(p)
          let content = ''
          if (ip) {
            ip = ip[1]
            content = reg.text.push.contentWoIp.exec(p)[1]
          } else {
            content = reg.text.push.content.exec(p)[1]
          }
          const img = this.findImg(content)
          const author = reg.text.push.author.exec(p)[1]
          text.push({p: p, type: types.push, data:{
            displayAuthor: i === 0
                           || text[i - 1].type !== types.push
                           || author !== text[i - 1].data.author,
            author,
            time: reg.text.push.time.exec(p)[1],
            type: reg.text.push.type.exec(p)[1],
            ip,
            content,
            img: {idx: imgArr.length, img},
            pushCnt,
          }})
          imgArr = [...imgArr, ...img]
          ++pushCnt
        } else {
          const img = this.findImg(p)
          text.push({
            p: p,
            type: reg.text.isReply.test(p)? types.reply : types.para,
            img: {idx: imgArr.length, img},
          })
          imgArr = [...imgArr, ...img]
        }
      }

      return {text, img: imgArr, info: {findDel, pushCnt}}
    }
  }

  fetchPost = async (board, aid) => {
    this.setState({fetching: true})
    await this.tryFetch(async () => {
      const con = await this.api.getPost(board, aid)
      if (con.status.status) {
        const processed = this.processPost(con.data.post.origin_post)
        this.setState({
          post: {
            ...con.data.post,
            processed,
          },
          fetching: false,
        })
        return {status: true}
      } else {
        return {status: false, str: con.status.str}
      }
    }, () => {
      this.setState({fetching: false})
    })
  }

  // update tops

  updateTop = async (idx=0) => {
    let elm = this.state.theme === Vars.theme.eink? document.body : document.scrollingElement
    const {overlay} = this.state
    if (overlay === Vars.overlay.initial) {
      await this.setState({favTop: {
        top: elm.scrollTop,
        in: true,
        boardI: idx,
      }})
    } else if (overlay === Vars.overlay.board) {
      await this.setState({boardTop: {
        top: elm.scrollTop,
        in: this.state.board,
        postI: idx,
      }})
    } else if (overlay === Vars.overlay.post) {
      await this.setState({postTop: {
        top: elm.scrollTop,
        in: this.state.post.aid,
      }})
    } else if (overlay === Vars.overlay.addPost) {
      await this.setState({boardTop: {
        top: -1,
        in: 'force board update',
      }})
    } else {
      console.log('No this overlay!!')
    }
  }

  // componentDidMount

  async componentDidMount() {
    if (navigator.userAgent.includes('Kobo eReader')) {
      this.setState({theme: Vars.theme.eink})
    }
    window.onscroll = this.handleScroll
    window.mobileCheck = function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }
    // if logged in before
    const con = await this.api.checkLogin()
    if (con.status) {
      await this.setState({
        isLogin: true,
        user: con.user,
        firstFetch: false,
      })
    } else {
      this.setState({
        firstFetch: false,
      })
    }
    // prevent disconnect from ptt
    this.preventDisconnect()
  }

  preventDisconnect = () => {
    let prevDis = setInterval(() => {
      if (this.state.isLogin) {
        // console.log('Sending prevent disconnect messages ...')
        this.api.preventDisconnect()
      }
    }, 40000)
    this.setState({prevDis})
  }

  componentWillUnmount() {
    clearInterval(this.state.prevDis)
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme === Vars.theme.eink? einkTheme : defaultTheme}>
        {this.state.firstFetch? (
          <div></div>
        ) : (
          <React.Fragment>
            <Helmet>
              <style>
                {`body {
                  background-color: ${this.state.theme === Vars.theme.eink? 'white': colors.grey[300]};
                }`}
              </style>
            </Helmet>
            <Router>
              {this.state.theme !== Vars.theme.eink && (
                <Bar
                  allBoard={this.state.allBoard}
                  back={this.state.back}
                  board={this.state.board}
                  fetching={this.state.fetching}
                  searchValue={this.state.searchValue}
                  onSearchChange={this.onSearchChange}
                  handleLogout={this.handleLogout}
                  isLogin={this.state.isLogin}
                  overlay={this.state.overlay}
                  post={this.state.post}
                  theme={this.state.theme}
                />
              )}
              {this.state.isLogin? (
                <Switch>
                  <Route path="/bbs">
                    <Bbs
                      addPost={this.api.addPost}
                      addPush={this.api.addPush}
                      boardList={this.state.boardList}
                      boardRangeBeg={this.state.boardRangeBeg}
                      boardTop={this.state.boardTop}
                      favTop={this.state.favTop}
                      fetchBoard={this.fetchBoard}
                      fetchFav={this.fetchFav}
                      fetchPost={this.fetchPost}
                      fetching={this.state.fetching}
                      post={this.state.post}
                      postList={this.state.postList}
                      postRangeBeg={this.state.postRangeBeg}
                      resetPostRangeBeg={this.resetPostRangeBeg}
                      postTop={this.state.postTop}
                      showMsg={this.showMsg}
                      theme={this.state.theme}
                      updateBack={this.updateBack}
                      updateBoard={this.updateBoard}
                      updateOverlay={this.updateOverlay}
                      updateTop={this.updateTop}
                    />
                  </Route>
                  <Route path="/about">
                    <About
                      updateOverlay={this.updateOverlay}
                    />
                  </Route>
                  <Route path="/search">
                    <Search
                      theme={this.state.theme}
                      allBoard={this.state.allBoard}
                      fetchAllBoard={this.fetchAllBoard}
                      fetchingSearch={this.state.fetchingSearch}
                      filterOptions={this.filterOptions}
                      searchValue={this.state.searchValue}
                      onSearchChange={this.onSearchChange}
                    />
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
                  <Route path="/about">
                    <About
                      updateOverlay={this.updateOverlay}
                    />
                  </Route>
                  <Route path="/login">
                    <Login
                      theme={this.state.theme}
                      handleInputChange={this.handleInputChange}
                      updateOverlay={this.updateOverlay}
                      handleLogin={this.handleLogin}
                    />
                  </Route>
                  <Route path="/">
                    <Redirect to="/login" />
                  </Route>
                </Switch>
              )}
            </Router>
            {this.state.theme === Vars.theme.eink && (
              <Fabs
                updateTop={this.updateTop}
              />
            )}
            {this.state.showSnack? (
              <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={this.state.showSnack}
                onClose={() => {this.setState({showSnack: false})}}
                autoHideDuration={this.state.snackMsg.autoHideDuration}
                TransitionComponent={(props) => (
                  this.state.theme === Vars.theme.eink? (
                    <Fade {...props} />
                  ) : (
                    <Slide {...props} direction="up" />
                  )
                )}
                style={{backgroundColor: ''}}
              >
                <Alert
                  severity={this.state.snackMsg.severity}
                  style={{
                    ...(this.state.theme === Vars.theme.eink? {
                      border: '2px solid black',
                      backgroundColor: 'white',
                      color: 'black',
                      boxShadow: '',
                    } : {
                      boxShadow: '0 0 20px grey',
                    }),
                  }}
                >
                  {this.state.snackMsg.title? (
                    <AlertTitle>
                      {this.state.snackMsg.title}
                    </AlertTitle>
                  ) : null}
                  {this.state.snackMsg.msg}
                </Alert>
              </Snackbar>
            ) : null}
          </React.Fragment>
        )}
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
            boardList={props.boardList}
            favTop={props.favTop}
            fetchFav={props.fetchFav}
            fetching={props.fetching}
            theme={props.theme}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
          />
        </Route>
        <Route path={`${match.path}/:board`}>
          <BoardPost
            addPost={props.addPost}
            addPush={props.addPush}
            boardTop={props.boardTop}
            boardRangeBeg={props.boardRangeBeg}
            fetchBoard={props.fetchBoard}
            fetchPost={props.fetchPost}
            fetching={props.fetching}
            post={props.post}
            postList={props.postList}
            postRangeBeg={props.postRangeBeg}
            resetPostRangeBeg={props.resetPostRangeBeg}
            postTop={props.postTop}
            showMsg={props.showMsg}
            theme={props.theme}
            updateBack={props.updateBack}
            updateBoard={props.updateBoard}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
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
        <Route path={`${match.path}/NewPost`}>
          <NewPost
            addPost={props.addPost}
            board={match.params.board}
            theme={props.theme}
            updateBack={props.updateBack}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
          />
        </Route>
        <Route path={`${match.path}/:aid`}>
          <Post
            addPush={props.addPush}
            board={match.params.board}
            fetchPost={props.fetchPost}
            fetching={props.fetching}
            post={props.post}
            postRangeBeg={props.postRangeBeg}
            resetPostRangeBeg={props.resetPostRangeBeg}
            postTop={props.postTop}
            theme={props.theme}
            updateBack={props.updateBack}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
          />
        </Route>
        <Route exact path={match.path}>
          <Board
            boardRangeBeg={props.boardRangeBeg}
            boardTop={props.boardTop}
            fetchBoard={props.fetchBoard}
            fetching={props.fetching}
            postList={props.postList}
            showMsg={props.showMsg}
            theme={props.theme}
            updateBack={props.updateBack}
            updateBoard={props.updateBoard}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
          />
        </Route>
      </Switch>
    </div>
  )
}

export default App
