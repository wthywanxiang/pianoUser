<template>
  <view class="category">
    <u-popup :show="TimeSelectShow"> </u-popup>
    <view class="nav">
      <scroll-view class="bg" scroll-y="true" :scroll-with-animation="true">
        <view class="item-wapper">
          <view
            class="nav-item"
            :class="{ ac: active == index }"
            v-for="(item, index) in rooms"
            :key="index"
            @click="gotopage(index)"
          >
            {{ index + 1 }}F
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="goodsBox">
      <view class="sticky" id="sticky1">
        <tn-sticky>
          <view class="StickyText">
            <view>
              <text style="color: black">正在查看</text>
            </view>
            <view>
              <u--text type="primary" size="15" :text="GetText()"></u--text>
            </view>
          </view>
        </tn-sticky>
      </view>
      <u-skeleton
        :loading="Loading"
        :animate="true"
        :rows="2"
        avatar
        v-for="item in 7"
        :key="item"
      >
      </u-skeleton>

      <view v-show="!Loading">
        <scroll-view
          scroll-y="true"
          @scroll="GoodsScroll"
          :scroll-top="scrollTop"
          :style="ScrollStyle"
        >
          <view class="goods">
            <view
              class="goods-item"
              v-for="(item, index) in rooms"
              :id="'a' + index"
              :key="index"
            >
              <view style="min-height: 50rpx"> </view>
              <view v-for="(item1, index1) in item" :key="index1" class="good">
                <image class="Img" src="@/static/logo.png" mode=""></image>
                <view class="good-button">
                  <view>
                    <u--text size="20" :text="item1.name"></u--text>
                  </view>
                  <tn-button
                    :backgroundColor="ButtonColor(item1)"
                    @click="ButtonClick(item1)"
                    >预约
                  </tn-button>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view>
        <tn-goods-nav
          :shadow="true"
          :fixed="true"
          :options="options"
          :buttonGroups="buttonGroups"
          @buttonClick="NavButton"
          @optionClick="Wait"
        ></tn-goods-nav>
      </view>

      <view class="tips">
        <tn-tips position="center" ref="tips"></tn-tips>
      </view>

      <u-modal
        :show="ModalShow"
        :title="'是否确认预约' + ChooseRoom.name + '号琴房'"
        :closeOnClickOverlay="true"
        :showCancelButton="true"
        :buttonReverse="true"
        confirmText="确认"
        cancelText="取消"
        @confirm="Reverse"
        @cancel="ModalShow = false"
        @close="ModalShow = false"
      >
      </u-modal>

      <u-popup :show="Popshow">
        <u-picker
          :show="Popshow"
          ref="uPicker"
          cancelText="请选择预约时间段"
          :columns="TimeList"
          @confirm="ConfirmTime"
          @change="changeHandler"
        ></u-picker>
      </u-popup>
    </view>
  </view>
</template>
<script>
import colorGradient from "../../uni_modules/uview-ui/libs/function/colorGradient";
import { data } from "../../uni_modules/uview-ui/libs/mixin/mixin";
import { AvailableRoom, CreateReserve } from "@/common/api.js";
export default {
  data() {
    return {
      TimeSelectShow: false,
      ModalShow: false,
      ScreenHeight: 0,
      Loading: true,
      active: 0,
	  initlock:true,
      //滑动锁
      navlock: false,
      scrollTop: 0,
      kindnumber: 0,
      showwidth: 0,
      ReserveStartTime: null,
      ReserveEndTime: null,
      ChooseRoom: {
        id: null,
        name: null,
      },
      TopList: [],
      Popshow: true,
      TimeList: [
        [null, null],
        [
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
        ],
        [
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
        ],
      ],
      rooms: null,
      options: [
        {
          icon: "service",
          text: "反馈",
        },
      ],
      buttonGroups: [
        {
          text: "查看预约",
          backgroundColor: "tn-main-gradient-indigo",
        },
        {
          text: "确认预约",
          backgroundColor: "#96F3DE",
        },
      ],
    };
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.ScreenHeight = res.screenHeight;
      },
    });
    this.timeinit();
  },
  methods: {
    init() {
	  this.initlock=false
      for (let item in this.rooms) {
        this.kindnumber++;
        let id = "#a" + item;
        const query = uni.createSelectorQuery().in(this);
        query
          .select(id)
          .boundingClientRect((data) => {
            this.TopList.push(data.top);
          })
          .exec();
      }
    },
    timeinit() {
      let day = new Date();
      let tomorrow = new Date();
      tomorrow.setDate(day.getDate() + 1);
      this.TimeList[0] = [
        day.getMonth() + 1 + "月" + day.getDate() + "日",
        tomorrow.getMonth() + 1 + "月" + tomorrow.getDate() + "日",
      ];
      day = day.getDay();
      let now = new Date();
      console.log(now.getHours());
      //周六琴房早下班
      if (day === 6) {
        this.TimeList[1] = [
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ];
        this.TimeList[2] = [
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
        ];
      } else if (day === 5) {
        this.TimeList[1] = [
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
        ];
        this.TimeList[2] = [
          "7:00",
          "8:00",
          "9:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
        ];
      }
    },
    gotopage(index) {
	  if(this.initlock)this.init();
      this.scrollTop = this.TopList[index];
      this.navlock = true;
      this.active = index;
    },
    GoodsScroll(e) {
	  if(this.initlock)this.init();
      for (let item in this.rooms) {
        if (e.detail.scrollTop >= this.TopList[this.kindnumber - item - 1]) {
          if (!this.navlock) this.active = this.kindnumber - item - 1;
          else this.navlock = false;
          break;
        }
      }
    },
    GetText() {
      let text = this.active + 1;
      return text + "F";
    },
    ButtonColor(item) {
      if (item.id !== this.ChooseRoom.id) {
        return "tn-main-gradient-indigo--reverse";
      }
      return "tn-main-gradient-indigo--light";
    },
    ButtonClick(item) {
      if (item.id === this.ChooseRoom.id) {
        this.ChooseRoom.id = null;
      } else {
        this.$refs.tips.show({
          msg: "您选择了" + item.name + "号琴房",
          backgroundColor: "#01BEFF",
          fontColor: "#FFFFFF",
          duration: 1500,
        });
        this.ChooseRoom.id = item.id;
        this.ChooseRoom.name = item.name;
      }
    },
    NavButton(index) {
      if (index.index == 1) {
        if (!this.ChooseRoom.id) {
          this.$refs.tips.show({
            msg: "您还没有选择琴房",
            backgroundColor: "#E83A30",
            fontColor: "#FFFFFF",
            duration: 1500,
          });
        } else {
          this.ModalShow = true;
        }
      } else {
        uni.navigateTo({
          url: "../history/history",
        });
      }
    },
    Wait(index) {
      this.$refs.tips.show({
        msg: "该功能还未上线",
        backgroundColor: "#01BEFF",
        fontColor: "#FFFFFF",
        duration: 1500,
      });
    },
    Reverse() {
      this.ModalShow = false;
	  const beginTime=this.ReserveStartTime.getTime()
	  const endTime=this.ReserveEndTime.getTime()
      CreateReserve({
        beginTime: beginTime,
        endTime: endTime,
        roomId: this.ChooseRoom.id,
      }).then((res) => {
        console.log(res);
        uni.switchTab({
          url: "/pages/user/user",
        });
      });
    },
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values,
        index,
        picker = this.$refs.uPicker,
      } = e;
      if (columnIndex === 1) {
        picker.setColumnValues(2, this.TimeList[2].slice(index));
      }
    },
    ConfirmTime(e) {
      let begin = new Date();
      begin.setDate(begin.getDate() + e.indexs[0]);
      begin.setHours(7 + e.indexs[1]);
      begin.setMinutes(0);
      begin.setSeconds(0);
      begin.setMilliseconds(0);
      let end = new Date();
      end.setDate(end.getDate() + e.indexs[0]);
      end.setHours(8 + e.indexs[1]);
      end.setMinutes(0);
      end.setSeconds(0);
      end.setMilliseconds(0);
      console.log(begin);
      this.ReserveStartTime = begin;
      this.ReserveEndTime = end;
      if (begin.getTime() < new Date().getTime()) {
        this.$refs.tips.show({
          msg: "请选择正确的时间段",
          backgroundColor: "#01BEFF",
          fontColor: "#FFFFFF",
          duration: 1500,
        });
      } else {
        this.Popshow = false;
		begin=begin.getTime()
		end=end.getTime()
        AvailableRoom({
          beginTime: begin,
          endTime: end,
        }).then((res) => {
          console.log(res.data);
          this.rooms = res.data;
          this.Loading = false;
        });
      }
    },
  },
  computed: {
    ScrollStyle() {
      let height;
      height = this.ScreenHeight * 0.8;
      return "height:" + height + "px";
    },
  },
};
</script>
<style scoped lang="scss">
.category {
  display: flex;
  position: absolute;
  width: 100%;
  height: calc(100% - var(--status-bar-height));

  /* 隐藏滚动条样式 */
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  uni-scroll-view {
    height: 100%;
  }

  .bg {
    background: #e5e5e5;
  }

  .nav {
    width: 200rpx;
    height: 100%;
    box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
      inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
      inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

    .item-wapper {
      box-shadow: inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9);

      .nav-item {
        width: 200rpx;
        height: 104rpx;
        line-height: 104rpx;
        font-size: 28rpx;
        color: #505660;
        text-align: center;
        position: relative;
      }
    }

    .ac {
      box-shadow: 0rpx 0rpx 30rpx rgba(0, 0, 0, 0.15),
        inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
        inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

      color: #26a69a;
      font-size: 30rpx;
      background: #fff;
    }
  }

  .goodsBox {
    width: 550rpx;

    .sticky {
      display: flex;
      justify-content: space-around;
      width: 550rpx;
      height: 50rpx;

      .StickyText {
        display: flex;
        height: 50rpx;
        width: 200rpx;
        align-items: center;
        justify-content: space-around;
      }
    }

    .goods {
      padding: 30rpx 0;

      .goods-item {
        flex-wrap: wrap;
        margin-bottom: 70rpx;
        margin-right: 65rpx;

        .good {
          display: flex;
          width: 500rpx;
          margin: 5% 25rpx;
          border-radius: 10rpx;
          box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.15),
            inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
            -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.8),
            inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

          .Img {
            display: block;
            width: 200rpx;
            height: 200rpx;
            margin: 0 auto 32rpx;
            border-radius: 4rpx;
          }

          .good-button {
            padding-right: 30rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        }
      }
    }
  }
}
</style>
