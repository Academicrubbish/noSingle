<template>
	<view class="open">
		<view class="text-center text-xxl animation-slide-bottom open_title">
			<text class="text-black text-bold">No Single</text>
		</view>
		<view class="text-center margin-top text-bold animation-slide-bottom open_comment">
			<text>- 为你而准备 -</text>
		</view>
		<view class="animation-slide-bottom open_login">
			<view class="cu-bar btn-group login_btn">
				<button class="cu-btn bg-green shadow-blur round lg" @click="judgeUser">登录</button>
			</view>
			<!-- <view class="text-center text-grey margin-top" @tap="browse"><text style="text-decoration: underline">先看看</text> -->
		</view>

		<view class="text-xs text-gray animation-slide-bottom open_bottom">
			<view>
				<image src="../../static/open/me.jpg" />
				致谢那个嘴里卡着灯泡的自己
			</view>
		</view>
	</view>
</template>

<script>
	// pages/open/open.js
	const db = uniCloud.database() //创建数据库连接
	import store from '../../store'
	import { nowtime } from '../../utils/utils.js'
	export default {
		data() {
			return {
				mark: true,
				day: ''
			}
		},
		methods: {
			//第一步，先判断是否注册过
			//第二步，注册过就去数据库拿用户信息；没有注册过就跳转注册页
			judgeUser() {
				uni.showLoading({ title: '登录中' })
				//获取code
				uni.login({
					provider: 'weixin',
					success: codeRes => {
						// 通过code获取openId 标识用户
						uniCloud.callFunction({
								name: 'login',
								data: { code: codeRes.code }
							}).then(openIdRes => {
								//将openid存储到store里
								store.commit('setUserOpenId', openIdRes.result.data.openid)
								// 通过openId查看数据库里是否存在这个用户
								db.collection('user')
									.where({ _openid: openIdRes.result.data.openid })
									.get()
									.then(res => {
										if (res.result.data.length === 0) { //数据库没有这个用户的信息
											uni.hideLoading()
											uni.navigateTo({ url: '/pages_other/register/register' })
										} else { // 往store里存储用户信息
											this.userDataToStore(res.result.data)
										}
									})
									.catch(err => {
										this.toCatch()
									})
							})
							.catch(err => {
								this.toCatch()
							})
					},
					fail: () => {
						this.toCatch()
					}
				})
			},
			userDataToStore(userData) {
				store.commit('setUserData', userData[0])
				uni.hideLoading()
				uni.switchTab({ url: '/pages/profile/profile' })
			},
			toCatch() {
				uni.showToast({
					title: '登陆失败，请稍后再试',
					icon: 'none',
					position: 'center',
					duration: 2000
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.open {
		height: 100%;

		.open_title {
			animation-delay: 0.2s;
			margin-top: 300rpx;
		}

		.open_comment {
			animation-delay: 0.3s;
		}

		.open_login {
			animation-delay: 0.4s;

			.login_btn {
				margin-top: 280rpx;
			}
		}

		.open_bottom {
			animation-delay: 0.5s;
			position: fixed;
			bottom: 100rpx;
			width: 100%;
			text-align: center;

			image {
				display: inline-block;
				vertical-align: middle;
				width: 40rpx;
				height: 40rpx;
				border-radius: 40rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>