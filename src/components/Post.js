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

    console.log(this.props.post.processed)
  }

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  render() {
    const {post} = this.props
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
                <Typography key={i} variant="body1" style={{color: 'green'}}>
                  {p.p}
                </Typography>
              ) : p.type === types.del? (
                <Linkify key={i}>
                  <Typography variant="body1" style={{color: 'green', marginBottom: 20}}>
                    {p.p}
                  </Typography>
                </Linkify>
              ) : p.type === types.push? (
                <Push
                  key={i}
                  p={p.data}
                  theme={this.props.theme}
                  displayAuthor={true}
                  showLightbox={this.showLightbox}
                />
              ) : (
                <Paragraph
                  key={i}
                  theme={this.props.theme}
                  style={p.type === types.reply? {color: '#80A29C'} : {}}
                  para={p.p}
                  img={p.img}
                  showLightbox={this.showLightbox}
                />
              ))}
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
