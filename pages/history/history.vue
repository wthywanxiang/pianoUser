<template>
  <view class="wapper">
    <u-skeleton
      :loading="Skeleton"
      :animate="true"
      :rows="2"
      avatar
      v-for="item in 10"
      :key="item"
    >
    </u-skeleton>

    <view v-if="!Skeleton">
      <view class="teacher" v-if="Isteacher">
        <u-sticky>
          <view class="Subsection">
            <u-subsection
              :list="ClassList"
              @change="ClassChange"
              :current="Current"
              buttonColor="#31C9E8"
              inactiveColor="#5E625A"
            ></u-subsection>
          </view>
        </u-sticky>
        <view
          class="HistoryWapper"
          v-for="(item, index) in Class"
          :key="index"
          :id="'Class' + index"
        >
          <tn-list-view
            class="HistoryView"
            :title="item[0].clazz"
            unlined="bottom"
            :current="Current"
          >
            <tn-list-cell
              class="HistoryCell"
              :unlined="true"
              v-for="(item1, index1) in item"
              :key="index1"
              @click="CheckStudent(item1)"
            >
              <view class="MessageWapper">
                <view class="message">
                  <view class="message__left" >
                    <tn-avatar
                      :src="getAvatar(item1)"
                    ></tn-avatar>
                  </view>
                  <view class="message__middle">
                    <view class="message__name">{{ item1.name }}</view>
                    <view class="message__content tn-text-ellipsis">
                      <u--text
                        :text="StudentText(item1.detail)"
                        :type="StudentType(item1.detail)"
                        size="18"
                      >
                      </u--text>
                    </view>
                  </view>
                  <view class="message__right">
                    <view class="message__time">{{
                      item1.detail.lengthOfTime + "小时"
                    }}</view>
                  </view>
                </view>
              </view>
            </tn-list-cell>
          </tn-list-view>
        </view>

        <u-popup mode="bottom" @close="ClosePopup" :show="PopupShow">
          <tn-list-view>
            <tn-list-cell :unlined="true">
              <view class="message" style="display: flex;align-items: center;">
                <view class="message__left">
                  <tn-avatar
                    :src="getAvatar(Popup)"
                  ></tn-avatar>
                </view>
                <view class="message__middle" style="margin-left: 25rpx;">
                  <view class="message__name">{{ Popup.name }}</view>
                </view>
              </view>
            </tn-list-cell>
            <tn-list-cell>
              预约次数：{{ Popup.detail.reserveCount }}次
            </tn-list-cell>
            <tn-list-cell>
              违约次数：{{ Popup.detail.violationCount?Popup.detail.violationCount:0 }}次
            </tn-list-cell>
            <tn-list-cell> 练习时长：{{ Popup.detail.lengthOfTime }}小时 </tn-list-cell>
            <tn-list-cell class="Cell">
              <view style="display: flex">
                <view> 状态总结： </view>
                <u--text
                  :text="StudentText(Popup)"
                  :type="StudentType(Popup)"
                ></u--text>
              </view>
            </tn-list-cell>
          </tn-list-view>
        </u-popup>
      </view>

      <view class="history-body" v-else>
        <u-empty
          mode="history"
          text="现在还没预约记录哦"
          :show="history.length === 0"
        ></u-empty>
        <view class="HistoryWapper" v-if="history.length !== 0">
          <tn-list-view
            class="HistoryView"
            title="历史记录(点击查看详细记录)"
            unlined="bottom"
          >
            <tn-list-cell
              class="HistoryCell"
              :unlined="true"
              v-for="(item, index) in history"
              :key="index"
              @click="CheckHistory(item)"
            >
              <view class="MessageWapper">
                <view class="message">
                  <view class="message__left">
                    <tn-avatar
                      src="https://tnuiimage.tnkjapp.com/avatar/xiaomai1.jpg"
                    ></tn-avatar>
                  </view>
                  <view class="message__middle">
                    <view class="message__name">{{ item.name }}号</view>
                    <view class="message__content tn-text-ellipsis">
                      <u--text
                        :text="HistoryText(item)"
                        :type="TextType(item)"
                        size="18"
                      ></u--text>
                    </view>
                  </view>
                  <view class="message__right">
                    <view class="message__time">{{ item.lengthOfTime }}小时</view>
                  </view>
                </view>
              </view>
            </tn-list-cell>
          </tn-list-view>
        </view>
        <u-popup
          mode="bottom"
          @close="ClosePopup"
          :show="PopupShow"
          class="Popup"
        >
          <tn-list-view class="ListView">
            <tn-list-cell :unlined="true" class="ListCell">
              <view class="message" style="display: flex; align-items: center">
                <view>
                  <tn-avatar
                    src="https://tnuiimage.tnkjapp.com/avatar/xiaomai1.jpg"
                  ></tn-avatar>
                </view>
                <view>
                  <view class="message__name">房间号：{{ Popup.name }}</view>
                </view>
              </view>
            </tn-list-cell>	
            <tn-list-cell class="ListCell">
              <view class="message"> 开始时间：{{ Popup.beginTime }} </view>
            </tn-list-cell>
            <tn-list-cell class="ListCell">
              <view class="message"> 结束时间：{{ Popup.endTime }} </view>
            </tn-list-cell>
            <tn-list-cell class="ListCell">
              <view class="message"> 持续时间：{{ Popup.lengthOfTime }}小时 </view>
            </tn-list-cell>
            <tn-list-cell class="ListCell">
              <view style="display: flex" class="message">
                <view> 记录状态： </view>
                <u--text
                  :text="HistoryText(Popup)"
                  :type="TextType(Popup)"
                ></u--text>
              </view>
            </tn-list-cell>
          </tn-list-view>
        </u-popup>
      </view>
    </view>
  </view>
</template>

<script>
import { HistoryRecord,ViewStudents } from "@/common/api.js";
import list from "../../uni_modules/uview-ui/libs/config/props/list";
export default {
  onLoad() {
    this.Isteacher = getApp().globalData.Isteacher;
    if (this.Isteacher) {
		ViewStudents().then(res=>{
			console.log('res',res);
			this.Class=res.data
			this.ClassList=Array.from(this.Class).map((item)=>item[0].clazz)
			this.Skeleton = false;
		})
    } else {
      HistoryRecord().then((res) => {
        this.history=res.data
		console.log('res',res);
		this.Skeleton = false;
      });
    }
  },
  onReady() {
	  
  },
  onPageScroll(e) {
	if(this.initlock)this.init()
    if (this.Isteacher) {
      for (let item in this.TopList) {
        if (e.scrollTop >= this.TopList[this.ClassNumber - item - 1]) {
          if (!this.navlock) this.Current = this.ClassNumber - item - 1;
          else this.navlock = false;
          let test = this.ClassNumber - item - 1;
          break;
        }
      }
    }
  },
  data() {
    return {
      //是否是老师
      Isteacher: null,
      Skeleton: true,
      Popup:{
		  detail:{
			  
		  }
	  },
	  PopupShow:false,
	  //学生端数据源
      history: null,
	  
      navlock: false,
      Current: 0,
	  
	  //老师端数据源
	  clazzIndex:0,
      ClassList: null,
      TopList: [],
      ClassNumber: 0,
      Class: null,
	  initlock:true,
    };
  },
  methods: {
	init(){
		this.initlock=false
		for (let item in this.Class) {
		  let id = "#Class" + item;
		  console.log('init()init()',id);
		  this.ClassNumber++;
		  const query = uni.createSelectorQuery().in(this);
		  query
		    .select(id)
		    .boundingClientRect((data) => {
			  this.TopList.push(data.top)
		      console.log("高度为：" + data.top);
		    })
		    .exec();
		}
	},
    HistoryText(item) {
		// 0为未开始，1为正常结束，2为迟到，3为违约
      if (item.status===3) {
        return "违约记录";
      } else if (item.status==1) {
        return "准时记录";
      }
      return "迟到记录";
    },
    TextType(item) {
      if (item.status==1) {
        return "success";
      } else if (item.status==3) {
        return "error";
      }
      return "warning";	
    },
    CheckHistory(item) {
      this.Popup=item
	  this.PopupShow=true
    },
    StudentText(item) {
		if(!item.reserveCount)return "信誉：优";
      if (item.violationCount / item.reserveCount <= 0.1)
        return "信誉：优";
      else if (item.violationCount / item.reserveCount <= 0.3)
        return "信誉：良";
      else return "信誉：差";
    },
    StudentType(item) {
		if(!item.reserveCount)return "success";
      if (item.violationCount / item.reserveCount <= 0.1)
        return "success";
      else if (item.violationCount / item.reserveCount <= 0.3)
        return "warning";
      else return "error";
    },
    CheckStudent(item) {
      this.Popup=item
	  this.PopupShow=true
    },
    ClassChange(index) {
	  if(this.initlock)this.init()
      this.navlock = true;
      this.Current = index;
      console.log(this.TopList[index]);
      uni.pageScrollTo({
        scrollTop: this.TopList[index],
        duration: 0,
      });
    },
	getAvatar(s){
		if(s.avatar)return "http://localhost:8088/EKKO-KING/upload/images/"+s.sno+".jpg"
		return "https://tnuiimage.tnkjapp.com/avatar/xiaomai1.jpg";
	},
    ClosePopup() {
      this.PopupShow = false;
    },
  },
};
</script>

<style lang="scss">
.wapper {
  .teacher {
    .Subsection {
      background-color: #98e4f3;
    }

    .ClassList {
      background-color: red;
    }

    .HistoryWapper {
      width: 90%;
      margin: 5% 5%;
      box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
        inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
        -15rpx -15rpx 30rpx rgba(255, 255, 255, 0.8),
        inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

      .HistoryView {
        width: 90%;
        margin-left: 5%;

        .HistoryCell {
          .MessageWapper {
            border-radius: 10rpx;
            height: 90rpx;
            box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.15),
              inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
              -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.8),
              inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

            .message {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;

              &__left {
                width: 10%;
              }

              &__middle {
                width: 70%;
                padding-left: 20rpx;
                padding-right: 40rpx;
              }

              &__right {
                width: 20%;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }

  .history-body {
    .HistoryWapper {
      width: 90%;
      margin: 5% 5%;
      box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
        inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
        -15rpx -15rpx 30rpx rgba(255, 255, 255, 0.8),
        inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

      .HistoryView {
        width: 90%;
        margin-left: 5%;

        .HistoryCell {
          .MessageWapper {
            border-radius: 10rpx;
            height: 90rpx;
            box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.15),
              inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
              -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.8),
              inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

            .message {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;

              &__left {
                width: 10%;
              }

              &__middle {
                width: 70%;
                padding-left: 20rpx;
                padding-right: 40rpx;
              }

              &__right {
                width: 20%;
                align-items: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
