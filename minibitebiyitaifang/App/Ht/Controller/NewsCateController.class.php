<?php
namespace Ht\Controller;
use Think\Controller;
class NewsCateController extends PublicController{

	/*
	*
	* 构造函数，用于导入外部文件和公共方法
	*/
	public function _initialize(){
		$this->category = M('category');
	}

	/*
	*
	* 获取、查询栏目表新闻分类的数据
	*/
	public function index(){
		
		//获取分类表里所有新闻分类
		$cate_list = $this->category->where('tid=20')->order('sort desc,id desc')->select();
		$this->assign('cate_list',$cate_list);
		$this->display(); // 输出模板

	}


	/*
	*
	* 跳转添加或修改新闻分类页面
	*/
	public function add(){
		//如果是修改，则查询对应分类信息
		if (intval($_GET['cid'])) {
			$cate_id = intval($_GET['cid']);
		
			$cate_info = $this->category->where('id='.intval($cate_id))->find();
			if (!$cate_info) {
				$this->error('没有找到相关信息.');
			}
			$this->assign('cate_info',$cate_info);
		}
		$this->display();
	}


	/*
	*
	* 添加或修改栏目信息
	*/
	public function save(){

		//判断是否已经存在该栏目
		if (!intval($_POST['cid'])) {
			$check_id = $this->category->where('tid=20 AND name="'.trim($_POST['name']).'"')->getField('id');
			if (is_int($check_id)) {
				$this->error('栏目已存在.');
			}
		}

		//构建数组
		$this->category->create();
		//上传新闻分类图标
		if (!empty($_FILES["file"]["tmp_name"])) {
			//文件上传
			$info = $this->upload_pic($_FILES["file"],array('png'),"category/".date(Ymd));
		    if(!is_array($info)) {// 上传错误提示错误信息
		        $this->error($info);
		    }else{// 上传成功 获取上传文件信息
			    $this->category->bz_3 = 'UploadFiles/'.$info['savepath'].$info['savename'];
		    }
		}

		//保存数据
		if (intval($_POST['cid'])) {
			$result = $this->category->where('id='.intval($_POST['cid']))->save();
		}else{
			//保存添加时间
			$this->category->tid=20;
			$this->category->addtime = time();
			$result = $this->category->add();
		}
		//判断数据是否更新成功
		if ($result) {
			$this->success('操作成功.','index');
		}else{
			$this->error('操作失败.');
		}
	}


	/*
	*
	*  设置栏目推荐
	*/
	public function set_tj(){
		$tj_id = intval($_GET['tj_id']);
		$cate_info = $this->category->where('id='.intval($tj_id))->find();
		if (!$cate_info) {
			$this->error('栏目信息错误.');
		}
		$data=array();
		$data['bz_2'] = $cate_info['bz_2'] == '1' ?  0 : 1;
		$up = $this->category->where('id='.intval($tj_id))->save($data);
		if ($up) {
			$this->success('操作成功.');
		}else{
			$this->error('操作失败.');
		}
	}

	/*
	*
	* 栏目删除
	*/
	public function del(){
		//以后删除还要加权限登录判断
		$id = intval($_GET['did']);
		$check_info = $this->category->where('id='.intval($id))->find();
		if (!$check_info) {
			$this->error('非法操作.');
		}

		$res = $this->category->where('id='.intval($id))->delete();
		if ($res) {
			//把对应图片也一起删除
			unlink('./Data/'.$check_info['bz_3']);
			$this->redirect('index');
		}else{
			$this->error('操作失败.');
		}
	}


	/*
	*
	* 图片上传的公共方法
	*  $file 文件数据流 $exts 文件类型 $path 子目录名称
	*/
	private function upload_pic($file,$exts,$path){
		$upload = new \Think\Upload();// 实例化上传类
		$upload->maxSize   =  10485760 ;// 设置附件上传大小2M
		$upload->exts      =  $exts;// 设置附件上传类型
		$upload->rootPath  =  './Data/UploadFiles/'; // 设置附件上传根目录
		$upload->savePath  =  ''; // 设置附件上传（子）目录
		$upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
		$upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
		$upload->subName  = $path; //子目录创建方式，采用数组或者字符串方式定义
		// 上传文件 
		$info = $upload->uploadOne($file);
		if(!$info) {// 上传错误提示错误信息
		    return $upload->getError();
		}else{// 上传成功 获取上传文件信息
			//return 'UploadFiles/'.$file['savepath'].$file['savename'];
			return $info;
		}
	}
}