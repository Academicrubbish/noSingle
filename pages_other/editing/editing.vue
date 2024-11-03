<template>
	<view>
		<cu-custom :isBack="true" bgColor="bg-gradual-blue">
			<block slot="backText">返回</block>
			<block slot="content">发布</block>
		</cu-custom>
		<view class="cu-form-group">
			<textarea v-model="content" placeholder="生活中的100件事"></textarea>
		</view>

		<view class="cu-bar bg-white margin-top-xs">
			<view class="action">图片上传</view>
			<view class="action">{{ imgList.length }}/6</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-3 grid-square flex-sub">
				<view class="bg-img" @tap="ViewImage" :data-url="imgList[index]" v-for="(item, index) in imgList" :key="index">
					<image :src="imgList[index]" mode="aspectFill"></image>

					<view class="cu-tag bg-red" @tap.stop.prevent="DelImg" :data-index="index">
						<text class="cuIcon-close"></text>
					</view>
				</view>
				<view class="solids" @tap="chooseImg" v-if="imgList.length < 6">
					<text class="cuIcon-cameraadd"></text>
				</view>
			</view>
		</view>
		<view class="padding flex flex-direction margin-top">
			<button class="cu-btn bg-black lg round" @tap="uploadContent">发表</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	import store from '@/store'
	import { getRandomString, nowtime } from '@/utils/utils'
	export default {
		data() {
			return {
				content: '',
				product: [],
				imgList: []
			}
		},
		methods: {
			//选择图片
			chooseImg() {
				uni.chooseImage({ count: 6 }) //最多上传6张
					.then(res => {
						for (let item of res.tempFilePaths) {
							if (this.imgList.length < 6) {
								this.imgList = this.imgList.concat(item)
							}
						}
					})
			},
			//预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				})
			},
			//删除图片
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			//上传
			uploadContent() {
				if (this.content.trim() !== '') {
					uni.showLoading({
						title: '上传中',
						mask: true //开启蒙版遮罩
					})
					if (this.imgList.length !== 0) {
						for (let item of this.imgList) {
							this.uploadImg(item) //上传图片
						}
					} else {
						this.addContent()
					}
				} else {
					uni.showToast({
						icon: 'error',
						title: '内容为空'
					})
				}
			},

			uploadImg(ImgFile) {
				uniCloud.uploadFile({
					cloudPath: 'cloudstorage/talkImg/' + getRandomString() + '.png', // 上传至云端的路径
					filePath: ImgFile, // 小程序临时文件路径
					cloudPathAsRealPath: true,
					fileType: 'image',
				}).then(res => {
					this.product = this.product.concat(res.fileID)
					if (this.imgList.length === this.product.length) {
						//图片上载完成,将数据存入数据库
						this.addContent()
					}
				})
			},

			addContent() {
				db.collection('talk').add({
						'createTime': nowtime('yyyy-MM-dd hh:mm:ss'),
						'userData': store.state.userData,
						'content': this.content,
						'contentImgList': this.product,
						'praiseList': [],
						'replyList': []
					})
					.then(res => {
						uni.hideLoading()
						uni.switchTab({ url: '/pages/talk/talk' })
					})
					.catch(err => {
						console.log(err)
						uni.showToast({
							title: '发表失败，请稍后再试',
							icon: 'error',
							position: 'center',
							duration: 2000
						})
					})
			}
		}
	}
</script>

<style lang="scss">

</style>