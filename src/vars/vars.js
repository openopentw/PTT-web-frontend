const vars = (() => {
  let vars = {
    theme: {
      default: 0,
      eink: 1,
    },
    bar: {
      notLogin: 0,
      lobby: 1,
      board: 2,
      article: 3,
    },
    page: {
      // TODO: delete some
      login: 0,
      about: 1,
      favorite: 2,
      board: 3,
      article: 4,
    },
    overlay: {
      initial: 1200,
      board: 1300,
      post: 1400,
    },
    tabs: {}, // set up later
    board: {
      emptyBoard: '----------',
    }
  }
  vars.tabs = {
    [vars.bar.notLogin]: [vars.page.login, vars.page.about],
    [vars.bar.lobby]: [vars.page.favorite, vars.page.about],
  }
  return vars
})()

export default vars
