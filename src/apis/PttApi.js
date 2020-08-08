class PttApi {
  aid_to_name = (aid) => {
    tab = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
    l = 0
    for (let i = 0; i < aid.length - 2; ++i) {
      l = l * 64 + tab.indexOf(aid[i])
    }
    r = 0
    for (let i = aid.length - 2; i < aid.length; ++i) {
      r = r * 64 + tab.indexOf(aid[i])
    }
    return `M.${l}.A.${r}`
  }

  aid_to_url = (aid) => `https://www.ptt.cc/bbs/MobileComm/${this.aid_to_name(aid)}.html`
}

export default PttApi
