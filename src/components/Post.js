import React, {Component} from 'react'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"
import Linkify from 'linkifyjs/react'
import {withRouter} from "react-router"

import {CircularProgress, Container, Divider, Typography} from '@material-ui/core'

import Vars from '../vars/Vars.js'
import Push from './Push.js'

class Post extends Component {
  componentDidMount = async () => {
    const {aid} = this.props.match.params
    const {postTop, board} = this.props
    this.props.updateOverlay(Vars.overlay.post)
    this.props.updateBack(`/bbs/${board}`)
    if (postTop.in !== aid) {
      await this.props.fetchPost(board, aid)
    }
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = postTop.in !== aid? 0 : postTop.top
  }

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  regex = {
    isDel1: /^※ 發信站: 批踢踢實業坊\(ptt\.cc\), 來自: .*$/,
    isDel2: /^※ 文章網址: .*$/,
    isEdit: /^※ 編輯: .*$/,
    push: {
      isPush: /^. \w+\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      // eg.: '推 cook321     : 喜歡就買被，手機也沒多少錢                        07/09 22:34'
      type: /^(.) (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      author: /^. (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      time: /^. \w+\s*: .*(\d\d\/\d\d \d\d:\d\d$)/,
      content: /^. \w+\s*: (.*)\d\d\/\d\d \d\d:\d\d$/,
    },
  }

  render() {
    const {post} = this.props
    const origin_post = post.origin_post.split('\n')
    let lastAuthor = ''
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        {(!post.origin_post || this.props.fetching)? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress
              thickness={2}
              size={64}
            />
          </div>
        ) : (
          <React.Fragment>
            <div style={{marginBottom: 30}}>
              <Typography variant="h6" gutterBottom align="center" style={{marginBottom: 10}}>
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
            {origin_post.map((p, i) => !p? ( // 空行
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
              />
            ) : this.regex.isEdit.test(p)? (
              <Typography key={i} style={{fontSize: 20, color: 'green'}}>
                {p}
              </Typography>
            ) : this.regex.isDel1.test(p)? (
              <Typography key={i} style={{fontSize: 20, color: 'green'}}>
                {p}
              </Typography>
            ) : this.regex.isDel2.test(p)? (
              <Typography key={i} style={{fontSize: 20, color: 'green', marginBottom: 20}}>
                {p}
              </Typography>
            ) : (
              <Typography key={i} style={{fontSize: 20}}>
                <Linkify>
                  {p}
                </Linkify>
              </Typography>
            ))}
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Post)
