import React, {Component} from 'react'
import {colors} from '@material-ui/core'
import Linkify from 'linkifyjs/react'
import {Helmet} from "react-helmet"
import {withRouter} from "react-router"
import Lightbox from 'react-image-lightbox'

import {CircularProgress, Container, Divider, Typography} from '@material-ui/core'

import Vars from '../vars/Vars.js'
import Paragraph from './Paragraph.js'
import Push from './Push.js'
import matchAll from '../util/matchAll.js'

const imgReg = /(https?:\/\/.*\.(?:png|jpeg|gif|jpg))/gi
const imgurReg = /(https?:\/\/imgur\.com\/.......)(?!\.(png|jpeg|gif|jpg))/gi

class Post extends Component {
  state = {
    postImgI: 0,
    postImg: {
      // ['https://i.imgur.com/N0W0yZZ.jpg'],
      // ['https://i.imgur.com/VvstS6L.jpg'],
    },
    lightboxIsShow: false,
  }

  setPostImg = (isPost, idx, urls) => {
    console.log({[idx]: urls})
    this.setState(prevState => ({
      postImg: {
        ...prevState.postImg,
        [idx]: urls,
      },
    }))
  }

  showLightbox = (postImgI) => {
    this.setState({postImgI, lightboxIsShow: true})
  }

  regex = {
    isDel1: /^※ 發信站: 批踢踢實業坊\(ptt\.cc\), 來自: .*$/,
    isDel2: /^※ 文章網址: .*$/,
    isEdit: /^※ 編輯: .*$/,
    isSys: /^※ .*$/,
    isReply: /^: .*$/,
    push: {
      isPush: /^. \w+\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      // eg.: '推 cook321     : 喜歡就買被，手機也沒多少錢                        07/09 22:34'
      type: /^(.) (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      author: /^. (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      time: /^. \w+\s*: .*(\d\d\/\d\d \d\d:\d\d$)/,
      content: /^. \w+\s*: (.*)\d\d\/\d\d \d\d:\d\d$/,
    },
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

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  render() {
    const {post} = this.props
    let lastAuthor = ''
    let postImg = []
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        {(this.props.fetching || !(post.origin_post))? (
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
              {post.origin_post.split('\n').map((p, i) => !p? ( // 空行
                <div key={i} style={{height: 30}}/>
              ) : ((i < 4 && p[1] === '作' && p[2] === '者') // is header
                   || (i < 4 && p[1] === '標' && p[2] === '題')
                   || (i < 4 && p[1] === '時' && p[2] === '間')
                   || (i < 4 && p[1] === '─' && p[2] === '─'))? (
                null
              ) : this.regex.push.isPush.test(p)? (
                <Push
                  key={i}
                  p={{
                    author: this.regex.push.author.exec(p)[1],
                    time: this.regex.push.time.exec(p)[1],
                    type: this.regex.push.type.exec(p)[1],
                    content: this.regex.push.content.exec(p)[1],
                  }}
                  theme={this.props.theme}
                  displayAuthor={(() => {
                    const oldAuthor = (' ' + lastAuthor).slice(1)
                    lastAuthor = this.regex.push.author.exec(p)[1]
                    return oldAuthor !== lastAuthor
                  })()}
                  postImgI={i}
                  setPostImg={this.setPostImg}
                  showLightbox={this.showLightbox}
                />
              ) : this.regex.isEdit.test(p)? (
                <Typography key={i} variant="body1" style={{color: 'green'}}>
                  {p}
                </Typography>
              ) : this.regex.isDel1.test(p)? (
                <Typography key={i} variant="body1" style={{color: 'green'}}>
                  {p}
                </Typography>
              ) : this.regex.isDel2.test(p)? (
                <Linkify>
                  <Typography key={i} variant="body1" style={{color: 'green', marginBottom: 20}}>
                    {p}
                  </Typography>
                </Linkify>
              ) : this.regex.isSys.test(p)? (
                <Typography key={i} variant="body1" style={{color: 'green'}}>
                  {p}
                </Typography>
              ) : (
                <Paragraph
                  key={i}
                  para={p}
                  style={this.regex.isReply.test(p)? {color: '#80A29C'} : {}}
                  theme={this.props.theme}
                  ParaI={i}
                  postImg={(() => {
                    const matches = [
                      ...[...matchAll(imgReg, p)].map(url => url[0]),
                      ...[...matchAll(imgurReg, p)].map(url => `${url[0]}.jpg`),
                    ]
                    const oldLen = postImg.length
                    postImg = [...postImg, matches]
                    return {idx: oldLen, matches}
                  })()}
                  setPostImg={this.setPostImg}
                  showLightbox={this.showLightbox}
                />
              ))}
            </React.Fragment>
            {this.state.lightboxIsShow && (
              <Lightbox
                reactModalStyle={{overlay: {zIndex: 1400}}}
                mainSrc={postImg[this.state.postImgI]}
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
