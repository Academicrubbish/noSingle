<template>
	<view class="register">

		<view class="text-center text-xxl register_tip"
			:class="[second < 2?'animation-slide-bottom' : 'animation-slide-top animation-reverse']">
			<text class="text-black text-bold">在进入小程序之前，先完成一些你的基础信息配置吧🤪</text>
		</view>

		<view class="text-center text-xxl animation-slide-bottom register_title">
			<view><text class="text-black text-bold">你的基础信息</text></view>
			<view><text class="text-grey text-sm">认真填写，确保微信号可以被搜索到</text></view>
		</view>

		<view class="animation-slide-bottom margin-top-xl register_info">
			<view>
				<text class="cuIcon-discoverfill text-cyan margin-right-xs" />
				<text class="text-grey text-bold">你的性别</text>
				<view class="margin-top-lg text-center">

					<button class="cu-btn round lg" :style="'background-color: ' + (gender === 1 ? '#1cbbb4' : '#d9d9d9') + ';'"
						@click="btnClick" id="1">
						<view class="info_btn">
							<view class="btn_left margin-right">
								<image :src="'/static/open/' + (gender === 1 ? 'boy-checked.png' : 'boy.png')" mode="widthFix" />
							</view>
							<view :class="'btn_right ' + (gender === 1 ? 'text-white' : '')">男</view>
						</view>
					</button>

					<view class="info_divide" />

					<button class="cu-btn round lg" :style="'background-color: ' + (gender === 0 ? '#e03997' : '#d9d9d9') + ';'"
						@click="btnClick" id="0">
						<view class="info_btn">
							<view class="btn_left margin-right">
								<image :src="'/static/open/' + (gender === 0 ? 'girl-checked.png' : 'girl.png')" mode="widthFix" />
							</view>
							<view :class="'btn_right ' + (gender === 0 ? 'text-white' : '')">女</view>
						</view>
					</button>

				</view>
			</view>

			<view class="info_wec">
				<text class="cuIcon-activityfill text-red margin-right-xs" />
				<text class="text-grey text-bold">你的社交帐号</text>
				<input class="margin-top" placeholder="默认填写微信号，其他账号需备注(QQ:1226377893)" v-model="wec" />
				<view class="wec_line"></view>
			</view>

		</view>

		<view class="cu-bar btn-group animation-slide-bottom register_btn">
			<button class="cu-btn bg-green shadow-blur round lg" @click="submit">进入小程序</button>
		</view>

	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	import store from '@/store'
	import { nowtime } from '@/utils/utils'
	export default {
		data() {
			return {
				timer: null,
				second: 0,
				gender: -1,
				wec: ''
			}
		},
		onLoad() {
			this.timer = setInterval(this.countSecond, 1000)
		},
		methods: {
			countSecond() {
				this.second++
				if (this.second > 2) {
					clearInterval(this.timer)
				}
			},

			//获取用户性别	
			btnClick(e) {
				this.gender = Number(e.currentTarget.id)
			},

			//提交用户注册信息
			submit() {
				uni.showModal({
					title: '提示',
					content: '信息准确无误吗'
				}).then(res => {
					//用户点击确定
					if (res.confirm) {

						if (this.verify()) {

							uni.showLoading({
								// 显示加载中loading效果
								title: '注册中',
								mask: true //开启蒙版遮罩
							})

							const userData = {
								_openid: store.state.openid,
								wec: this.wec,
								userName: '小灯泡' + store.state.openid.substr(-6, 7),
								userImg: 'https://mp-5cf444f4-c29c-481e-8b46-af4bbb41ff8a.cdn.bspapp.com/cloudstorage/default/me.jpg',
								gender: Number(this.gender),
								motto: '默认签名',
								createTime: nowtime('yyyy-MM-dd hh:mm:ss')
							}

							this.databaseFunc(userData)
						}
					} else if (res.cancel) {
						//用户点击取消
					}
				})
			},

			//校验用户信息
			verify() {
				if (!this.wec.trim()) {
					uni.showToast({
						icon: 'none',
						title: '社交账号为空'
					})
					return false
				} else if (this.gender === -1) {
					uni.showToast({
						icon: 'none',
						title: '请选择性别'
					})
					return false
				}
				return true
			},

			//云数据库用户表新增
			databaseFunc(data) {
				db.collection('user')
					.add(data)
					.then(res => {
						store.commit('setUserData', data)
						uni.hideLoading()
						uni.switchTab({ url: '/pages/profile/profile' })
					})
					.catch(err => {
						uni.showToast({
							title: '注册失败，请稍后再试',
							icon: 'none',
							position: 'center',
							duration: 2000
						})
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.register {
		height: 100%;

		.register_tip {
			animation-delay: .2s;
			margin-top: 200rpx
		}

		.register_title {
			animation-delay: 2s;
		}

		.register_info {
			animation-delay: 2.5s;
			padding: 20rpx 40rpx;

			.info_btn {
				width: 100%;
				display: flex;
				text-align: center;
				align-items: center;

				.btn_left,
				.btn_right {
					width: 50%;
				}

				.btn_left {
					image {
						height: 60rpx;
						width: 60rpx;
					}
				}
			}

			.info_divide {
				display: inline-block;
				width: 140rpx;
			}

			.info_wec {
				margin-top: 60rpx;

				.wec_line {
					margin: 0 auto;
					height: 1rpx;
					margin-top: 7rpx;
					background-color: #ccc;
				}
			}
		}

		.register_btn {
			margin-top: 160rpx;
			animation-delay: 3s
		}
	}
</style>