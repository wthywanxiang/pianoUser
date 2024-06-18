<script>
	export default {
		globalData: {
			Isteacher: false,
			username: '',
			userimg: null,
			Reseve: true,
			number:null,
			userdesc: '这个人很懒什么都没有留下',
			reserve:null
		},
		onLaunch: function() {
			console.log('App Lauch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		onReady: function() {

		}
	}
</script>

<style lang="scss">
	@import './tuniao-ui/index.scss';
	@import './tuniao-ui/iconfont.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
</style>