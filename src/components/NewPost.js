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
    categoryValue: '',
    titleValue: '',
    contentValue: '',
  }

  clear = async () => {
    await this.setState({
      categoryValue: '',
      titleValue: '',
      contentValue: '',
    })
  }

  componentDidMount = async () => {
    const {board} = this.props
    this.props.updateOverlay(Vars.overlay.addPost)
    this.props.updateBack({title: board, url: `/bbs/${board}`})
    await this.clear()
  }

  render() {
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const {board} = this.props
          await this.props.addPost(
            board,
            this.state.categoryValue,
            this.state.titleValue,
            this.state.contentValue,
          )
          await this.clear()
          await this.props.updateTop()
          this.props.history.push(`/bbs/${board}`)
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
              style={{flexGrow: 1}}
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
