class Api {
  async checkApi() {
    const res = await fetch('/api')
    const con = await res.json()
    console.log(con)
    return con
  }

  async checkLogin() {
    const res = await fetch('/api/user')
    const con = await res.json()
    return con
  }

  async login(user, pass) {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: user, pass: pass})
    })
    const con = await res.json()
    return con
  }

  async logout() {
    const res = await fetch('/api/logout')
    const con = await res.json()
    return con
  }

  preventDisconnect() {
    this.getFavBoard()
  }

  async getFavBoard() {
    const res = await fetch('/api/get_fav_board')
    const con = await res.json()
    return con
  }

  async getPost(boardName, aid) {
    const res = await fetch('/api/get_post', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_name: boardName,
        aid: aid,
      })
    })
    let con = await res.json()
    return con
  }

  async getPosts(boardName, end_idx='recent', quick=true) {
    let remote = ''
    if (quick) {
      remote = '/api/get_posts_quick'
    } else {
      remote = '/api/get_posts'
    }
    const res = await fetch(remote, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        board_name: boardName,
        end_idx: end_idx,
      })
    })
    let con = await res.json()

    if (con.status.status) {
      // let postList = con.data.posts
      // for (let i in postList) {
      //   let post = postList[i]
      //   post.push_number = 0
      //   for (let j in post.push_list) {
      //     let push_list = post.push_list[j]
      //     if (push_list.type === 1) {
      //       ++post.push_number
      //     } else if (push_list.type === 2) {
      //       --post.push_number
      //     }
      //   }
      // }
    }

    return con
  }
}

export default Api
