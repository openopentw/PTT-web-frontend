import React, {Component} from 'react'
import {CircularProgress, Container, Divider, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import Linkify from 'linkifyjs/react'
import {Helmet} from "react-helmet"
import {withRouter} from "react-router"
import Lightbox from 'react-image-lightbox'

import Vars from '../vars/Vars.js'
import Paragraph from './Paragraph.js'
import Push from './Push.js'
import Reply from './Reply.js'

const style = {
  fontSize: 18,
  lineHeight: '2em',
}

const ToggleLightBox = (props) => props.lightboxIsShow && (
  <React.Fragment>
    <Helmet>
      <style>{`html {overflow: hidden}`}</style>
    </Helmet>
    <Lightbox
      reactModalStyle={{overlay: {zIndex: 1400}}}
      mainSrc={props.img[props.imgI][0]}
      nextSrc={props.imgI + 1 < props.img.length? props.img[props.imgI + 1][0] : null}
      prevSrc={props.imgI > 0? props.img[props.imgI - 1][0] : null}
      onMovePrevRequest={props.movePrev}
      onMoveNextRequest={props.moveNext}
      onCloseRequest={props.closeBox}
    />
  </React.Fragment>
)

class Post extends Component {
  state = {
    imgI: 0,
    lightboxIsShow: false,
  }

  showLightbox = (imgI) => {
    this.setState({imgI, lightboxIsShow: true})
  }

  fetchPost = async (rememberTop=false) => {
    const {board} = this.props
    const {aid} = this.props.match.params
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    let oldTop = elm.scrollTop
    await this.props.fetchPost(board, aid)
    if (rememberTop) {
      elm.scrollTop = oldTop
    }
  }

  componentDidMount = async () => {
    const {aid} = this.props.match.params
    const {post, postTop, board} = this.props

    document.title = `${this.props.post.title} - ${this.props.board} - PTT`
    this.props.updateOverlay(Vars.overlay.post)
    this.props.updateBack({title: board, url: `/bbs/${board}`})
    // if (postTop.in !== aid) {
    //   await this.props.fetchPost(board, aid)
    // }
    await this.props.fetchPost(board, aid)
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    // elm.scrollTop = postTop.in !== aid? 0 : postTop.top
    elm.scrollTop = 0
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    const {postRangeBeg, post, fetching} = prevProps
    if (!fetching && post && post.processed) {
      const postRangeLast = Math.min(postRangeBeg + 3 * Vars.postRange, post.processed.text.length) - 1
      let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
      return {
        scrollTop: elm.scrollTop,
        first: {
          postIdx: postRangeBeg,
          offsetTop: document.getElementById(`post-${postRangeBeg}`).offsetTop,
        },
        last: {
          postIdx: postRangeLast,
          offsetTop: document.getElementById(`post-${postRangeLast}`).offsetTop,
        }
      }
    }
    return null
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    // console.log(snapshot)
    if (prevProps.post.title !== this.props.post.title) {
      document.title = `${this.props.post.title} - ${this.props.board} - PTT`
    }
    if (snapshot !== null) {
      const {postRangeBeg} = this.props
      let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
      if (prevProps.postRangeBeg > postRangeBeg) { // scroll up
        let toScroll= snapshot.first.offsetTop - document.getElementById(`post-${snapshot.first.postIdx}`).offsetTop
        if (Math.abs(snapshot.scrollTop - elm.scrollTop - toScroll) > 5) { // browser has scrolled automatically
          elm.scrollTop -= toScroll
        }
      } else if (prevProps.postRangeBeg < postRangeBeg) { // scroll down
        let toScroll= snapshot.last.offsetTop - document.getElementById(`post-${snapshot.last.postIdx}`).offsetTop
        if (Math.abs(snapshot.scrollTop - elm.scrollTop - toScroll) > 5) { // browser has scrolled automatically
          elm.scrollTop -= toScroll
        }
      }
    }
  }

  componentWillUnmount = () => {
    this.props.updateTop()
    this.props.resetPostRangeBeg()
  }

  render() {
    const {theme, post, postRangeBeg, board} = this.props
    // const theme = Vars.theme.eink
    const {aid} = this.props.match.params
    const types = Vars.postTextType
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${theme === Vars.theme.eink? 'white' : colors.grey[200]}; }`}</style>
        </Helmet>
        {(this.props.fetching || !post || !(post.processed))? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress thickness={2} size={64} />
          </div>
        ) : (
          <React.Fragment>
            {postRangeBeg < 3 && (
              <div style={{marginBottom: 30}}>
                {postRangeBeg <= 0 && (
                  <Typography id="post-0" variant="h5" gutterBottom align="center" style={{marginBottom: 10}}>
                    {post.title}
                  </Typography>
                )}
                {postRangeBeg <= 1 && (
                  <Typography id="post-1" variant="subtitle1" gutterBottom align="center" style={{
                    color: theme === Vars.theme.eink? colors.grey[900] :colors.grey[700],
                  }}>
                    作者 {post.author}
                  </Typography>
                )}
                {postRangeBeg <= 2 && (
                  <Typography id="post-2" variant="subtitle1" gutterBottom align="center" style={{
                    color: theme === Vars.theme.eink? colors.grey[900] : colors.grey[700],
                  }}>
                    時間 {post.date}
                  </Typography>
                )}
              </div>
            )}
            {postRangeBeg <= 3 && (
              <div id="post-3" style={{
                ...theme === Vars.theme.eink? {
                  borderBottom: '1px solid',
                  borderColor: colors.grey[900],
                } : {
                  borderBottom: '2px solid',
                  borderColor: colors.grey[400],
                },
              }}/>
            )}
            <React.Fragment>
              {post.processed.text.slice(
                postRangeBeg, Math.min(postRangeBeg + Vars.postRange * 3, post.processed.text.length)
              ).map((p, i) => (
                <div key={postRangeBeg + i} id={`post-${postRangeBeg + i}`}>
                  {p.type === types.empty? (
                    <div style={{height: 30}}/>
                  ) : p.type === types.header? (
                    null
                  ) : p.type === types.sys? (
                    <Typography variant="body1" style={{
                      color: theme === Vars.theme.eink? colors.grey[900] : 'green',
                      ...Vars.style.post,
                    }}>
                      {p.p}
                    </Typography>
                  ) : p.type === types.del? (
                    <div>
                      <Linkify>
                        <Typography variant="body1" style={{
                          color: theme === Vars.theme.eink? colors.grey[900] : 'green',
                          ...Vars.style.post,
                        }}>
                          {p.p}
                        </Typography>
                      </Linkify>
                      <Reply
                        theme={theme}
                        fetchPost={this.fetchPost}
                        addPush={(type, content) => {
                          this.props.addPush(
                            this.props.board,
                            this.props.match.params.aid,
                            type,
                            content
                          )
                        }}
                      />
                    </div>
                  ) : p.type === types.push? (
                    <Push
                      p={p.data}
                      theme={theme}
                      style={Vars.style.post}
                      showLightbox={this.showLightbox}
                    />
                  ) : (
                    <Paragraph
                      theme={theme}
                      style={{
                        ...p.type === types.reply? {
                          color: theme === Vars.theme.eink? colors.grey[900] : '#80A29C',
                        } : {},
                        ...Vars.style.post,
                      }}
                      para={p.p}
                      img={p.img}
                      showLightbox={this.showLightbox}
                    />
                  )}
                </div>
              ))}
              {(!post.processed.info.findDel || post.processed.info.pushCnt > 5) && (
                <Reply
                  theme={theme}
                  fetchPost={this.fetchPost}
                  addPush={(type, content) => {
                    this.props.addPush(
                      this.props.board,
                      this.props.match.params.aid,
                      type,
                      content
                    )
                  }}
                />
              )}
            </React.Fragment>
            <ToggleLightBox
              lightboxIsShow={this.state.lightboxIsShow}
              img={post.processed.img}
              imgI={this.state.imgI}
              movePrev={() => {this.setState(prevState => ({imgI: prevState.imgI - 1}))}}
              moveNext={() => {this.setState(prevState => ({imgI: prevState.imgI + 1}))}}
              closeBox={() => {this.setState({lightboxIsShow: false})}}
            />
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Post)
