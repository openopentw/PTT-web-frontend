import React, {Component} from 'react'
import {CircularProgress, Snackbar, Slide, Fade} from '@material-ui/core'
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
    // data - post
    postList: [],
    post: {},
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

  showMsg = (severity, msg) => {
    this.setState({
      showSnack: true,
      snackMsg: {severity, msg},
    })
  }

  // login / logout

  handleInputChange = (n, v) => {
    this.setState({[n]: v})
  }

  handleLogin = async () => {
    this.showMsg(Vars.severity.info, '登入中…')
    const con = await this.api.login(this.state.user, this.state.pass)
    if (con.status) {
      this.showMsg(Vars.severity.success, `歡迎，${this.state.user}.`)
      this.setState({
        isLogin: con.status,
      })
    } else {
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
    if (this.state.overlay === Vars.overlay.board) {
      let elm = this.state.theme === Vars.theme.eink? document.body : document.scrollingElement
      if (!this.state.fetching && !this.state.fetchingMore && elm.scrollTop < 1024) {
        this.fetchBoardMore()
      }
    }
  }

  onSearchChange = (searchValue) => {
    this.setState({searchValue})
    console.log(searchValue)
  }

  // fetch

  fetchFav = async () => {
    this.setState({fetching: true})
    const con = await this.api.getFavBoard()
    if (con.status.status) {
      this.setState({
        boardList: con.data.b_list,
        fetching: false,
      })
    } else {
      this.showMsg(Vars.severity.error, con.status.str)
    }
  }

  fetchAllBoard = async () => {
    this.setState({fetchingSearch: true})
    const con = await this.api.getAllBoard()
    if (con.status.status) {
      this.setState({
        allBoard: con.data.b_list,
        fetchingSearch: false,
      })
    } else {
      this.showMsg(Vars.severity.error, con.status.str)
    }
  }

  fetchBoard = async (board) => {
    this.setState({fetching: true, fetchingMore: true})
    const con = await this.api.getPosts(board)
    if (con.status.status) {
      this.setState({
        postList: con.data.posts,
        fetching: false,
        fetchingMore: false,
      })
    } else {
      this.showMsg(Vars.severity.error, con.status.str)
    }
  }

  fetchBoardMore = async () => {
    await this.setState({fetchingMore: true})
    const {postList} = this.state
    const endI = postList.length
    const endIdx = postList[endI - 1].index - 1
    const con = await this.api.getPosts(this.state.board, endIdx)
    if (con.status.status) {
      let newPostList = con.data.posts
      let elm = this.state.theme === Vars.theme.eink? document.body : document.scrollingElement
      const oldToEnd = elm.scrollHeight - elm.scrollTop
      await this.setState({
        postList: postList.concat(newPostList),
      })
      elm.scrollTop = elm.scrollHeight - oldToEnd
      this.setState({fetchingMore: false})
    } else {
      this.showMsg(Vars.severity.error, con.status.str)
    }
  }

  findImg = (p) => {
    const reg = Vars.reg.img
    return [
      ...[...matchAll(reg.img, p)].map(url => url[0]),
      ...[...matchAll(reg.imgur, p)].map(url => `${url[0]}.jpg`),
    ]
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
          text.push({p: p, type: types.push, data:{
            author: reg.text.push.author.exec(p)[1],
            time: reg.text.push.time.exec(p)[1],
            type: reg.text.push.type.exec(p)[1],
            ip: ip,
            content: content,
            img: {idx: imgArr.length, img},
          }})
          imgArr = [...imgArr, ...img]
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

      return {text, img: imgArr}
    }
  }

  fetchPost = async (board, aid) => {
    this.setState({fetching: true})
    const con = await this.api.getPost(board, aid)
    if (con.status.status) {
      this.setState({
        post: {
          ...con.data.post,
          processed: this.processPost(con.data.post.origin_post)
        },
        fetching: false,
      })
    } else {
      this.showMsg(Vars.severity.error, con.status.str)
    }
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
              {this.state.isLogin? (
                <Switch>
                  <Route path="/bbs">
                    <Bbs
                      addPost={this.api.addPost}
                      addPush={this.api.addPush}
                      boardList={this.state.boardList}
                      boardTop={this.state.boardTop}
                      favTop={this.state.favTop}
                      fetchBoard={this.fetchBoard}
                      fetchBoardMore={this.fetchBoardMore}
                      fetchFav={this.fetchFav}
                      fetchPost={this.fetchPost}
                      fetching={this.state.fetching}
                      fetchingMore={this.state.fetchingMore}
                      post={this.state.post}
                      postList={this.state.postList}
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
                      searchValue={this.state.searchValue}
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
            {this.state.theme === Vars.theme.eink? (
              <Fabs
                updateTop={this.updateTop}
              />
            ) : null}
            {this.state.showSnack? (
              <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={this.state.showSnack}
                onClose={() => {this.setState({showSnack: false})}}
                autoHideDuration={4000}
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
            boardTop={props.boardTop}
            addPost={props.addPost}
            addPush={props.addPush}
            fetchBoard={props.fetchBoard}
            fetchBoardMore={props.fetchBoardMore}
            fetchPost={props.fetchPost}
            fetching={props.fetching}
            fetchingMore={props.fetchingMore}
            post={props.post}
            postList={props.postList}
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
            postTop={props.postTop}
            theme={props.theme}
            updateBack={props.updateBack}
            updateOverlay={props.updateOverlay}
            updateTop={props.updateTop}
          />
        </Route>
        <Route exact path={match.path}>
          <Board
            boardTop={props.boardTop}
            fetchBoard={props.fetchBoard}
            fetchBoardMore={props.fetchBoardMore}
            fetching={props.fetching}
            fetchingMore={props.fetchingMore}
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
