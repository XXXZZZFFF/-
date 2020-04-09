App({
  globalData: {
    socketStatus: 'closed',
    array: [],
    array2: [],
    data: [{ type: '' }],
    data2: [{ type: '' }],
    rivalName: '',
    category: [],
    openid: null,
    nickname: '',
    headimgurl: '',
    question: '',
    ques: '随机题库',
    category_id: 1,
    category_id2: 0,
    user_exit_game:'',
    question_id: '',
    user_category:[]
  },
  onLaunch: function () {
    var that = this;
    if (that.globalData.socketStatus === 'closed') {
      that.openSocket();
    }
  },
  openSocket() {
    var that = this;
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      var ping = JSON.stringify({
        type: "ping",
        message: {}
      })
      this.globalData.socketStatus = 'connected';
      this.sendMessage(ping);
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.closeSocket();
      this.globalData.socketStatus = 'closed'
      that.openSocket();
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      //把JSONStr转为JSON
      message = message.data.replace(" ", "");
      if (typeof message != 'object') {
        message = message.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(message);
        message = jj;
      }
      // console.log("【websocket监听到消息】内容如下：");
      console.log(message);

      if (message.type == 'start_game') {
        that.globalData.data = message
      } else if (message.type == 'end_game') {
        that.globalData.data2 = message
      } else if (message.type == 'rank_list_mini') {
        that.globalData.array2 = message
      } else if (message.type == 'category') {
        that.globalData.category = message
      } else if (message.type == 'question') {
        that.globalData.question = message
      } else if (message.type == 'user_category') {
        that.globalData.user_category = message
      } else if (message.type == 'user_exit_game') {
        that.globalData.user_exit_game = message
      } else {
        that.globalData.array = message
      }
    })
    // 打开信道
    wx.connectSocket({
      url: "wss://battle.sysmex.com.cn/wss",
    })
  },

  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },

  //发送消息函数
  sendMessage(data) {
    var that = this;
    this.globalData.array = ''
    if (this.globalData.socketStatus === 'connected') {
      //自定义的发给后台识别的参数 ，我这里发送的是name
      wx.sendSocketMessage({
        data: data
      })
    }
  },
})