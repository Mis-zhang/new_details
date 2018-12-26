<template>
  <div id="app" class="app">
    <div class="details_nav">
      <van-nav-bar title="详情" :right-text="rightTitle" fixed left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    </div>
    <div class="details_wrapper">
      <div class="details_container">
        <div class="title">{{ infoList.title }}</div>
        <div class="sourcetime van-hairline--bottom">
            <div class="source">来源：{{ infoList.source }}</div>
            <div class="time">{{ infoList.publishTime | formatDate }}</div>
          </div>
        <div class="images">
            <div class="photo" :style="'display:' + isShow">
              <img v-lazy="imgPath + infoList.defaultImg" alt="">
            </div>
          </div>
        <div class="content">{{ infoList.content }}</div>
        <div class="bottom">
          <div class="author">作者：{{ infoList.author }}</div>
          <div class="editor">责任编辑：{{ infoList.publishPerson }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        globKey: "YjU5YTA3NzEtMDI2MS00YzhiLTljM2ItYzE2MTljZDQwNDNhNGExYjEzZTUtYmIx",
        articleId: '',
        token: '',
        infoList: {},
        imgPath: '',
        rightTitle: '',
        isFollow: '',
        isShow: '',
      }
    },
    created() {
      this.articleId = this.getUrlParam('articleId')
      this.token = this.getUrlParam('token')
      this.imgPath = this.$img
      this.getInfoList()
    },
    methods: {
      onClickLeft() {
         let ua = navigator.userAgent.toLowerCase();
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          //Ios
          window.webkit.messageHandlers.isBack.postMessage(null)
        } else if (/(Android)/i.test(navigator.userAgent)) {
          //Android终端
          window.mobile.isBack()
        }
      },
      onClickRight() {
        if (this.token === null || this.token === "(null)") {
          this.rightTitle = '关注'
          window.webkit.messageHandlers.isLogin.postMessage(null)
        } else {
          var sign = this.$md5("articleId=" + this.articleId + "&token=" + this.token + "&key=" + this.globKey),
            that = this
          this.axios
            .post(
              "/api/user/follow/article",
              this.$qs.stringify({
                articleId: that.articleId,
                token: that.token,
                sign: sign
              })
            )
            .then(function(res) {
              if (res.data.result.code === '200' && res.data.result.message === "取消关注成功！") {
                that.rightTitle = '关注'
                that.$notify({message: '取消关注成功！', color: '#fff'});
              } else if (res.data.result.code === '200' && res.data.result.message === "关注成功！") {
                that.rightTitle = '取消关注'
                that.$notify({message: '关注成功！', color: '#fff'})
              }
            })
            .catch(function(err) {
              if (err.response) {
                console.log(err.response)
                that.$toast.fail('请求失败，请重试');
              }
            });
        }
      },
      getInfoList() {
        var sign = this.$md5(
            "articleId=" + this.articleId + "&token=" + this.token + "&key=" + this.globKey
          ),
          that = this
        this.axios
          .post(
            "/api/user/article/info",
            this.$qs.stringify({
              articleId: that.articleId,
              token: that.token,
              sign: sign
            })
          )
          .then(function(res) {
            that.infoList = res.data.data.article
            that.isFollow = res.data.data.article.isFollow
            that.isShow = res.data.data.article.defaultImg === null || res.data.data.article.defaultImg === '' ? 'none' : 'block'
            that.rightTitle = res.data.data.article.isFollow === 1 ? '取消关注' : '关注'
          })
          .catch(function(err) {
            if (err.response) {
              console.log(err.response)
            }
          });
      },
      getUrlParam(params) {
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) {
          return unescape(r[2])
        }
        return null;
      },
    },
    filters: {
      formatDate: function(value) {
        let date = new Date(value)
        let y = date.getFullYear()
        let MM = date.getMonth() + 1
        MM = MM < 10 ? "0" + MM : MM
        let d = date.getDate()
        d = d < 10 ? "0" + d : d
        let h = date.getHours()
        h = h < 10 ? "0" + h : h
        let m = date.getMinutes()
        m = m < 10 ? "0" + m : m
        let s = date.getSeconds()
        s = s < 10 ? "0" + s : s
        return y + "." + MM + "." + d
      }
    },


  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
  }

  body {
    width: 100%;
    height: 100%;
    font-family: "Microsoft YaHei";
    .app {
      width: 100%;
      height: 100%;
      .details_nav {
        width: 100%;
        height: 100px;
        .van-nav-bar {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgb(74, 204, 62);
          .van-nav-bar__left {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
            .van-icon {
              color: #fff;
              font-size: 35px;
              display: flex;
              justify-content: center;
              align-items: center;
              -webkit-tap-highlight-color: transparent;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              user-select: none;
            }
          }
          .van-nav-bar__title {
            color: #fff;
            font-size: 32px;
            letter-spacing: 8px;
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          .van-nav-bar__right {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            .van-nav-bar__text {
              color: #fff;
              font-size: 26px;
              display: flex;
              justify-content: center;
              align-items: center;
              letter-spacing: 8px;
              -webkit-tap-highlight-color: transparent;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              user-select: none;
            }
          }
        }
      }
      .details_wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        .details_container {
          flex: 1;
          padding: 0px 20px;
          display: flex;
          flex-direction: column;
          .title {
            width: 100%;
            padding: 20px 0px;
            font-size: 32px;
            color: rgb(51, 51, 51);
            letter-spacing: 3px;
          }
          .sourcetime {
            display: flex;
            padding: 20px 0px 30px 0px;
            align-items: center;
            .source {
              color: rgb(153, 153, 153);
              font-size: 26px;
            }
            .time {
              color: rgb(153, 153, 153);
              font-size: 26px;
              margin-left: 50px;
            }
          }
          .images {
            width: 100%;
            height: 100%;
            display: flex;
            .photo {
              width: 100%;
              padding: 50px 0px 0px 0px;
              text-align: center;
              img {
                max-width: 100%;
              }
              img[lazy="loading"] {
                max-width: 100%;
              }
            }
          }
          .content {
            width: 100%;
            font-size: 30px;
            line-height: 50px;
            color: rgb(102, 102, 102);
            padding: 30px 0px;
          }
          .bottom {
            width: 100%;
            padding: 20px 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .author {
              font-size: 26px;
              color: rgb(153, 153, 153);
            }
            .editor {
              font-size: 26px;
              color: rgb(153, 153, 153);
            }
          }
        }
      }
    }
    .van-toast--default {
      width: 180px;
      height: 180px;
      .van-loading {
        width: 50px;
        height: 50px;
      }
      .van-toast__text {
        padding-top: 30px;
      }
    }
    .van-toast__text {
      font-size: 26px;
    }
    .van-notify {
      padding: 40px 0px;
      font-size: 28px;
    }
  }
</style>
