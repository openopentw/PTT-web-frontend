import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Button, Container, TextField} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"
import {PostAdd} from '@material-ui/icons'

import Vars from '../vars/Vars.js'

const style = {
  marginTop: 20,
  marginBottom: 20,
}

class NewPost extends Component {
  state = {
    submitting: false,
    categoryValue: '',
    titleValue: '',
    contentValue: '',
  }

  addPost = () => {
    const {board} = this.props
    this.props.addPost(
      board,
      this.state.categoryValue,
      this.state.titleValue,
      this.state.contentValue,
    )
    this.setState({
      categoryValue: '',
      titleValue: '',
      contentValue: '',
      submitting: false,
    })
    this.props.history.push(`/bbs/${board}`)
  }

  componentDidMount = () => {
    document.title = '發表文章 - PTT'
    const {board} = this.props
    this.props.updateOverlay(Vars.overlay.addPost)
    this.props.updateBack({title: board, url: `/bbs/${board}`})
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = 0
  }

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  render() {
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (!this.state.submitting) {
            this.setState({submitting: true})
            this.addPost()
          }
        }}>
          <div style={{display: 'flex', ...style}}>
            <TextField
              autoFocus
              value={this.state.categoryValue}
              onChange={(e) => {this.setState({categoryValue: e.target.value})}}
              style={{width: '8em', marginRight: 10}}
              label="分類"
              variant="outlined"
              InputProps={{style: {fontSize: 20}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
            <TextField
              label="標題"
              value={this.state.titleValue}
              onChange={(e) => {this.setState({titleValue: e.target.value})}}
              style={{flex: 1}}
              variant="outlined"
              InputProps={{style: {fontSize: 20}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
          </div>
          <div style={style}>
            <TextField
              fullWidth
              value={this.state.contentValue}
              onChange={(e) => {this.setState({contentValue: e.target.value})}}
              multiline
              label="內文"
              variant="outlined"
              style={{}}
              InputProps={{style: {fontSize: 20, minHeight: '50vh', alignItems: 'flex-start'}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
          </div>
          <div style={{textAlign: 'center', ...style}}>
            <Button type="submit" variant="outlined" style={{fontSize: 20}}>
              <PostAdd style={{marginRight: 4}} />
              發文
            </Button>
          </div>
        </form>
      </Container>
    )
  }
}

export default withRouter(NewPost)
