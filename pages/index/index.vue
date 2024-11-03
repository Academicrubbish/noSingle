<template>
	<view style="height: 100%">
		<user-info v-if="index" :info="info" state="Add" @close="closeInfo"></user-info>
		<view class="text-center">
			<image src="https://mp-5cf444f4-c29c-481e-8b46-af4bbb41ff8a.cdn.bspapp.com/cloudstorage/default/head.png">
			</image>
		</view>

		<view class="cu-card">
			<view class="cu-item shadow" style="margin-top: 0">
				<view class="text-gray text-xl text-right padding" @tap="report">
					<text class="cuIcon-question"></text>
				</view>
				<view class="text-center text-bold text-xl margin-top">
					<text>点一下，不要我教你吧😏</text>
				</view>
				<view class="text-center text-bold text-lg margin-top">
					<text class="cuIcon-refresharrow"></text>
				</view>
				<view class="padding flex flex-direction margin-bottom">
					<button class="cu-btn bg-black lg round shadow" @tap="ccc">冲冲冲</button>
				</view>
			</view>
		</view>
		<!-- 获取微信号弹窗 -->
		<!-- 	<view :class="'cu-modal ' + (index ? 'show' : '')">
			<view class="cu-dialog" style="width: 70%">
				<view class="cu-list menu-avatar margin-top">
					<view class="cu-avatar round lg" :style="'background-image:url(' + product.userImageUrl + ');'"></view>
					<view class="text-black text-lg text-bold" style="padding-top: 10rpx">{{ product.name }}</view>
					<view class="text-grey text-md margin-top">
						{{ product.motto }}
					</view>
				</view>
				<view style="height: 140rpx">
					<view style="margin-top: 140rpx">{{ product.wec }}</view>
				</view>
				<view class="cu-bar justify-center">
					<button class="cu-btn bg-black round" @tap="hideModal">复制</button>
				</view>
			</view>
		</view> -->
		<!-- 举报弹窗 -->
		<view :class="'cu-modal ' + (status ? 'show' : '')">
			<view class="cu-dialog" style="width: 70%">
				<view style="height: 30rpx" class="bg-white"></view>
				<view class="cu-form-group">
					<view class="title">举报账号：</view>
					<input @input="reportUserFun" :value="reportUser" />
				</view>
				<view class="cu-form-group">
					<view class="title">举报原因：</view>
					<input @input="reportReasonFun" :value="reportReason" />
				</view>
				<view class="cu-form-group">
					<view class="title">
						良人得寻，退出江湖
						<text class="cuIcon-right padding-left"></text>
					</view>
					<button :class="'cu-btn bg-' + (judgment ? 'cyan' : 'gray') + ' round'" @tap="leave">离开</button>
				</view>
				<view class="cu-bar justify-center">
					<button class="cu-btn bg-black round" @tap="report">取消</button>
					<button class="cu-btn bg-red round margin-left-xl" @tap="goReport">举报</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { friendRequest, getToken, clickSubscribeMessage } from '@/utils/subscription.js'
	import userInfo from '@/components/userInfo'
	import store from '@/store'
	const db = uniCloud.database() //创建数据库连接
	export default {
		components: { userInfo },
		data() {
			return {
				product: {
					motto: '老子不可能没对象',
					wec: '15629671026',
					userImageUrl: 'https://mp-5cf444f4-c29c-481e-8b46-af4bbb41ff8a.cdn.bspapp.com/cloudstorage/default/me.jpg',
					userName: '只是',
					name: ''
				},
				index: 0,
				status: false,
				reportReason: '',
				reportUser: '',
				judgment: false,
				info: {}
			}
		},
		onHide() {
			this.status = false
		},
		methods: {
			closeInfo() {
				this.index = 0
			},
			ccc() {
				this.info = store.state.userData
				this.index = 1
			},
			async bbb() {
				let info = { text: '交个朋友咯', }
				let res = await friendRequest(info)
				console.log('结果：', res.result)
				if (res.result.data.errcode === 42001) { //token过期
					await getToken()
					console.log(222)
				} else {
					uni.showToast({
						icon: 'none',
						title: '好友申请已发送',
						duration: 2000
					})
				}
			},
			aaa() {
				db.collection('user')
					.aggregate()
					.match({ gender: 0 })
					.sample({ size: 1 })
					.end()
					.then(res => {
						this.product = res.result.data[0]
						this.index = 1
					})
			},
			showModal() {
				if (app.globalData.val) {
					uni.showToast({
						icon: 'error',
						title: '请先登录哦'
					})
				} else {
					if (app.globalData.count) {
						let gender = 'man'
						if (app.globalData.gender == 'man') {
							gender = 'wom'
						}
						Promise.all([
							//先把用户的次数变成0
							wx.cloud
							.database()
							.collection(app.globalData.gender)
							.where({ _openid: app.globalData.openid })
							.update({ data: { count: 0 } })
							.then(() => {
								app.globalData.count = 0
							}),
							//从异性数据库中随机获取一条返回
							wx.cloud
							.database()
							.collection(gender)
							.aggregate()
							.sample({ size: 1 })
							.end()
							//Aggregate.sample(size: number): Aggregate聚合阶段。随机从文档中选取指定数量的记录。
							.then(res => {
								this.product = res.list[0]
							})
						]).then(() => {
							this.index = 1
						})
					} else {
						//次数为0
						uni.showToast({
							icon: 'error',
							title: '明天再来吧'
						})
					}
				}
			},

			hideModal() {
				this.index = 0
				//复制微信号
				uni.setClipboardData({ data: this.product.wec })
			},

			report() {
				if (app.globalData.val) {
					uni.showToast({
						icon: 'error',
						title: '请先登录哦'
					})
				} else {
					if (this.status) {
						this.judgment = false
					}
					this.status = !this.status
				}
			},

			reportUserFun(e) {
				this.reportUser = e.detail.value
			},

			reportReasonFun(e) {
				this.reportReason = e.detail.value
			},

			leave() {
				if (!this.judgment) {
					uni.showModal({
						title: '提示',
						content: '这将会删除你的所有信息'
					}).then(res => {
						if (res.confirm) {
							this.judgment = true
						}
					})
				} else {
					uni.exitMiniProgram({
						success: res => {
							wx.cloud
								.database()
								.collection(app.globalData.gender)
								.where({ _openid: app.globalData.openid })
								.remove({})
						}
					})
				}
			},

			goReport() {
				if (this.reportUser == '' || this.reportReason == '') {
					uni.showToast({
						icon: 'error',
						title: '举报信息为空'
					})
				} else {
					uni.showLoading({
						title: '上传举报信息中',
						mask: true
					})
					wx.cloud
						.database()
						.collection('report')
						.add({
							data: {
								reportUser: this.reportUser,
								reportReason: this.reportReason
							}
						})
						.then(() => {
							uni.showToast({
								icon: 'secuess',
								title: '举报成功'
							})
							this.reportReason = ''
							this.reportUser = ''
						})
				}
			}
		}
	}
</script>
<style>
	page {
		background-color: rgba(114, 130, 138, 0.2);
	}
</style>