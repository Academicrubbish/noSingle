<template>
	<view>

		<cu-custom :isBack="true" bgColor="bg-white">
			<block slot="backText">返回</block>
			<block slot="content">用户信息</block>
		</cu-custom>

		<view class="cu-list menu card-menu margin-top">
			<!-- 更换头像 -->
			<view class="cu-bar bg-white margin-top-xs">
				<view class="action">更换头像</view>
				<view class="action">{{ imgList.length }}/1</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-3 grid-square flex-sub">
					<view class="solids" @tap="chooseImg" v-if="!imgList.length">
						<text class="cuIcon-cameraadd"></text>
					</view>
					<view class="bg-img" @tap="viewImg" :data-url="imgList[index]" v-for="(item, index) in imgList" :key="index">
						<image :src="imgList[index]" mode="aspectFill" />
						<view class="cu-tag bg-red" @tap.stop.prevent="deteleImg" :data-index="index">
							<text class="cuIcon-close"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 更换昵称 -->
			<view class="cu-form-group">
				<view class="title">昵称：</view>
				<input type="text" v-model="userData.userName" maxlength="12" />
			</view>
			<!-- 更换签名 -->
			<view class="cu-form-group">
				<view class="title">签名：</view>
				<input type="text" v-model="userData.motto" maxlength="15" />
			</view>
			<!-- 更换社交帐号 -->
			<view class="cu-form-group">
				<view class="content">
					<view class="title">社交帐号：{{ userData.wec }}</view>
				</view>
				<view class="action">
					<button class="cu-btn round bg-green shadow" @tap="change">修改</button>
				</view>
			</view>
			<!-- 填写新账号 -->
			<view class="cu-form-group" v-show="wecState">
				<view class="title">新社交帐号：</view>
				<input type="text" v-model="newWec" />
			</view>
		</view>
		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-green lg round" @tap="uploadUserData">更新信息</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	import store from '@/store'
	import { getRandomString } from '@/utils/utils'
	export default {
		data() {
			return {
				userData: { userName: '小灯泡', motto: '你能看到我就是网络不佳', wec: '1226377893' },
				imgList: [],
				newWec: '',
				imgState: false,
				wecState: false,
				updateData: {}
			}
		},
		onLoad() {
			this.userData = store.state.userData
			this.imgList.push(store.state.userData.userImg)
		},
		methods: {
			//更新失败
			errShow() {
				uni.showToast({
					title: '更新失败，请稍后再试',
					icon: 'none',
					position: 'center',
					duration: 2000
				})
			},

			//校验用户信息
			verify() {
				if (this.imgList.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '头像不能为空'
					})
					return false
				} else if (!this.userData.userName.trim()) {
					uni.showToast({
						icon: 'none',
						title: '昵称不能为空'
					})
					return false
				} else if (!this.userData.motto.trim()) {
					uni.showToast({
						icon: 'none',
						title: '签名不能为空'
					})
					return false
				}
				return true
			},

			uploadUserData() {
				if (this.verify()) {
					uni.showLoading({
						title: '更新中',
						mask: true //开启蒙版遮罩
					})
					if (this.imgState && this.imgList.length !== 0) {
						this.imgData()
					} else {
						this.wordData()
					}
				}
			},
			wordData(userInfo, talkInfo) {
				let wecNumber = this.wec
				if (this.wecState && this.newWec.trim() !== '') {
					wecNumber = this.newWec
				}


				db.collection('user')
					.where({ _openid: store.state.openid, })
					.update({
						userName: this.userData.userName,
						motto: this.userData.motto,
						wec: wecNumber
					})
					.then(() => { //存入数据库成功，修改讨论区用户姓名
						db.collection('talk')
							.where({ _openid: store.state.openid, })
							.update({ userName: this.userData.userName, })
							.then(() => { //修改成功
								uni.showToast({
									title: '更新成功',
									icon: 'none'
								})
								uni.reLaunch({ url: '/pages/open/open' })
							})
					})
					.catch(() => {
						this.errShow()
					})
			},
			//更新图片流，第一步判断用户之前是否有头像，如果有删掉
			imgData() {
				if (
					store.state.userData.userImg !== '' &&
					store.state.userData.userImg !==
					'https://mp-5cf444f4-c29c-481e-8b46-af4bbb41ff8a.cdn.bspapp.com/cloudstorage/default/me.jpg'
				) {
					let imgList = []
					imgList.push(store.state.userData.userImg)
					uniCloud.callFunction({
						name: 'delImage',
						data: { imgList: imgList }
					})
				}
				uniCloud.uploadFile({
						cloudPath: 'cloudstorage/userImg/' + getRandomString() + '.png', // 上传至云端的路径
						filePath: this.imgList[0], // 小程序临时文件路径
						cloudPathAsRealPath: true,
						fileType: 'image'
					})
					.then(res => { //图片上载完成,将其他信息数据存入数据库
						db.collection('user')
							.where({ _openid: store.state.openid, })
							.update({
								userImg: res.fileID, //上传图片地址就是 res.fileID
								userName: this.userData.userName,
								motto: this.userData.motto,
								wec: this.userData.wec
							})
							.then(() => { //存入数据库成功，修改讨论区用户头像
								db.collection('talk')
									.where({ _openid: store.state.openid, })
									.update({ userName: this.userData.userName, userImg: res.fileID, })
									.then(() => { //修改成功
										uni.showToast({
											title: '更新成功',
											icon: 'none'
										})
										uni.reLaunch({ url: '/pages/open/open' })
									})
									.catch(err => {
										this.errShow()
									})
							})
							.catch(err => {
								this.errShow()
							})
					})
					.catch(err => {
						this.errShow()
					})
			},

			/**
			 * 头像相关方法
			 * chooseImg() 选择头像
			 * viewImg() 查看头像
			 * deteleImg() 删除头像
			 */
			chooseImg() {
				uni.chooseImage({ count: 1 }) //最多上传1张
					.then(res => {
						if (res.tempFilePaths.length > 0) {
							this.imgState = true //选择图片一定更换了图片，就走上传图片流
							this.imgList = res.tempFilePaths
						}
					})
			},
			viewImg(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				})
			},
			deteleImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			/**
			 * 社交帐号
			 * change() 弹出社交帐号输入框
			 */
			change() {
				uni.showModal({
					title: '提示',
					content: '为保证他人可以搜索到您，请认真检查修改后的账号',
					success: res => {
						if (res.confirm) {
							this.wecState = true
						}
					}
				})
			},
		}
	}
</script>