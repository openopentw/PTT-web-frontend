export default {
  number: {
    retryMax: 3,
  },
  theme: {
    default: 0,
    eink: 1,
  },
  severity: {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
  },
  overlay: {
    initial: 0,
    board: 1,
    post: 2,
    addPost: 3,
  },
  board: {
    emptyBoard: '----------',
  },
  boardRange: 35,
  postRange: 35,
  postTextType: {
    empty: 0,
    header: 1,
    del: 2,
    sys: 3,
    push: 4,
    reply: 5,
    para: 6,
  },
  reg: {
    img: {
      img: /(https?:\/\/.*\.(?:png|jpeg|gif|jpg))/gi,
      elseImgur: /(https?:\/\/.?\.?imgur\.com\/\w{7})(?!\.(png|jpeg|gif|jpg))/gi,
      imgur: /(https?:\/\/.?\.?imgur\.com\/\w{7})(?:\.(png|jpeg|gif|jpg))/i,
    },
    text: {
      isDel: /^※ 文章網址: .*$/,
      isSys: /^※ .*$/,
      isPush: /^. \w+\s*: .*\d\d\/\d\d \d\d:\d\d$/,
      // eg.: '推 cook321     : 喜歡就買被，手機也沒多少錢                        07/09 22:34'
      push: { // extract data from push:
        type: /^(.) (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
        author: /^. (\w+)\s*: .*\d\d\/\d\d \d\d:\d\d$/,
        time: /^. \w+\s*: .*(\d\d\/\d\d \d\d:\d\d$)/,
        ip: /^. \w+\s*: .* (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) \d\d\/\d\d \d\d:\d\d$/,
        content: /^. \w+\s*: (.*)\d\d\/\d\d \d\d:\d\d$/,
        contentWoIp: /^. \w+\s*: (.*) \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3} \d\d\/\d\d \d\d:\d\d$/,
      },
      isReply: /^: .*$/,
    },
  },
  style: {
    post: {
      fontSize: 20,
      lineHeight: '2em',
    },
  },
}
