import React, {Component} from 'react'
import {Button, CircularProgress, Container, Divider, TextField, Typography} from '@material-ui/core'
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

class Post extends Component {
  state = {
    imgI: 0,
    lightboxIsShow: false,
  }

  showLightbox = (imgI) => {
    this.setState({imgI, lightboxIsShow: true})
  }

  componentDidMount = async () => {
    const {aid} = this.props.match.params
    const {postTop, board} = this.props
    this.props.updateOverlay(Vars.overlay.post)
    this.props.updateBack({title: board, url: `/bbs/${board}`})
    if (postTop.in !== aid) {
      await this.props.fetchPost(board, aid)
    }
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = postTop.in !== aid? 0 : postTop.top
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

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  render() {
    const {post, board} = this.props
    const {aid} = this.props.match.params
    const types = Vars.postTextType
    let lastAuthor = ''
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        {(this.props.fetching || !post || !(post.processed))? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress
              thickness={2}
              size={64}
            />
          </div>
        ) : (
          <React.Fragment>
            <div style={{marginBottom: 30}}>
              <Typography variant="h5" gutterBottom align="center" style={{marginBottom: 10}}>
                {post.title}
              </Typography>
              <Typography variant="subtitle1" gutterBottom align="center" style={{color: 'grey'}}>
                作者 {post.author}
              </Typography>
              <Typography variant="subtitle1" gutterBottom align="center" style={{color: 'grey'}}>
                時間 {post.date}
              </Typography>
            </div>
            <Divider />
            <React.Fragment>
              {post.processed.text.map((p, i) => p.type === types.empty? (
                <div key={i} style={{height: 30}}/>
              ) : p.type === types.header? (
                null
              ) : p.type === types.sys? (
                <Typography key={i} variant="body1" style={{
                  color: this.props.theme === Vars.theme.eink? colors.grey[900] : 'green',
                  ...Vars.style.post,
                }}>
                  {p.p}
                </Typography>
              ) : p.type === types.del? (
                <div>
                  <Linkify key={i}>
                    <Typography variant="body1" style={{
                      color: this.props.theme === Vars.theme.eink? colors.grey[900] : 'green',
                      ...Vars.style.post,
                    }}>
                      {p.p}
                    </Typography>
                  </Linkify>
                  <Reply
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
                  key={i}
                  p={p.data}
                  theme={this.props.theme}
                  style={Vars.style.post}
                  displayAuthor={i === 0
                                 || post.processed.text[i - 1].type !== types.push
                                 || p.data.author !== post.processed.text[i - 1].data.author}
                  showLightbox={this.showLightbox}
                />
              ) : (
                <Paragraph
                  key={i}
                  theme={this.props.theme}
                  style={{
                    ...p.type === types.reply? {
                      color: this.props.theme === Vars.theme.eink? colors.grey[900] : '#80A29C',
                    } : {},
                    ...Vars.style.post,
                  }}
                  para={p.p}
                  img={p.img}
                  showLightbox={this.showLightbox}
                />
              ))}
                {/*<Reply
                fetchPost={this.fetchPost}
                addPush={(type, content) => {
                  this.props.addPush(
                    this.props.board,
                    this.props.match.params.aid,
                    type,
                    content
                  )
                }}
              />*/}
            </React.Fragment>
            {this.state.lightboxIsShow && (
              <Lightbox
                reactModalStyle={{overlay: {zIndex: 1400}}}
                mainSrc={post.processed.img[this.state.imgI]}
                nextSrc={post.processed.img[this.state.imgI + 1]}
                prevSrc={post.processed.img[this.state.imgI - 1]}
                onMovePrevRequest={() => {this.setState(prevState => ({imgI: prevState.imgI - 1}))}}
                onMoveNextRequest={() => {this.setState(prevState => ({imgI: prevState.imgI + 1}))}}
                onCloseRequest={() => {this.setState({lightboxIsShow: false})}}
              />
            )}
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Post)
