<?php
namespace Ht\Controller;
use Think\Controller;
class PanicController extends PublicController{
	//**********************************************
	//说明：产品列表管理 推荐 修改 删除 列表 搜索
	//**********************************************
	public function index(){
		$aaa_pts_qx=1;
		$id=(int)$_GET['id'];
		$shop_id=(int)$_GET['shop_id'];

		//搜索变量
		$type=$this->htmlentities_u8($_GET['type']);
		$tuijian=$this->htmlentities_u8($_GET['tuijian']);
		$name=$this->htmlentities_u8($_GET['name']);
		//===============================
		// 产品列表信息 搜索
		//===============================
		//搜索
		$where="1=1 AND pro_type=2 AND del<1";
		$tuijian!=='' ? $where.=" AND type=$tuijian" : null;
		$shop_id>0 ? $where.=" AND shop_id=$shop_id" : null;
		$name!='' ? $where.=" AND name like '%$name%'" : null;
		define('rows',20);
		$count=M('product')->where($where)->count();
		$rows=ceil($count/rows);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$page_index=$this->page_index($count,$rows,$page);
		$productlist=M('product')->where($where)->order('addtime desc')->limit($limit,rows)->select();
		//dump($productlist);exit;
		foreach ($productlist as $k => $v) {
			$productlist[$k]['shangchang'] = M('shangchang')->where('id='.intval($v['shop_id']))->getField('name');
			$productlist[$k]['cname'] = M('category')->where('id='.intval($v['cid']))->getField('name');
			$productlist[$k]['start_time'] = date("Y-m-d H:i",$v['start_time']);
			$productlist[$k]['end_time'] = date("Y-m-d H:i",$v['end_time']);
		}

		//==========================
		// 将GET到的数据再输出
		//==========================
		$this->assign('id',$id);
		$this->assign('tuijian',$tuijian);
		$this->assign('name',$name);
		$this->assign('type',$type);
		$this->assign('shop_id',$shop_id);
		$this->assign('page',$page);
		//=============
		// 将变量输出
		//=============	
		$this->assign('productlist',$productlist);
		$this->assign('page_index',$page_index);
		$this->display();
	}
	//**********************************************
	//说明：产品 添加修改
	//注意：cid 分类id  shop_id店铺id
	//**********************************************
	public function add(){	

		$id=(int)$_GET['id'];
		$page=(int)$_GET['page'];
		$name=$_GET['name'];
		$type=$_GET['type'];

		if($_POST['submit']==true){
			if (!$_POST['start_time']) {
				$this->error('请输入抢购开始时间.');
				exit();
			}
			if (!$_POST['end_time']) {
				$this->error('请输入抢购结束时间.');
				exit();
			}
		try{	
			//如果不是管理员则查询商家会员的店铺ID
			$id = intval($_POST['pro_id']);
			$pid = intval($_POST['pid']);
			if ($pid) {
				$pinfo = M('product')->where('id='.intval($pid))->find();
				$_POST['intro'] = $pinfo['intro'];
				$_POST['shop_id'] = $pinfo['shop_id'];
				$_POST['cid'] = $pinfo['cid'];
				$_POST['brand_id'] = $pinfo['brand_id'];
				$_POST['pro_number'] = $pinfo['pro_number'];
				$_POST['price'] = $pinfo['price'];
				$_POST['content'] = $pinfo['content'];
				$_POST['company'] = $pinfo['company'];
			}
			$array=array(
				'name'=>$_POST['name'] ,
				'intro'=>$_POST['intro'] ,
				'shop_id'=> intval($_POST['shop_id']) ,//所属店铺
				'cid'=> intval($_POST['cid']) ,			//产品分类ID
				'brand_id'=> intval($_POST['brand_id']) ,//产品品牌ID
				'pro_number'=>$_POST['pro_number'] ,	//产品编号
				'sort'=>(int)$_POST['sort'] , 
				'price'=>(float)$_POST['price'] , 
				'price_yh'=>(float)$_POST['price_yh'] ,
				'price_jf'=>(float)$_POST['price_jf'] ,//赠送积分
				'updatetime'=>time(),
				'num'=>(int)$_POST['num'] ,			//库存
				'content'=>$_POST['content'] , 
				'company'=>$_POST['company'],  //产品单位
				'renqi'=> intval($_POST['renqi']) ,	//产品人气
				'pro_type'=>2,
				'start_time'=>strtotime($_POST['start_time']),
				'end_time'=>strtotime($_POST['end_time']),
			);
			  
			//判断产品详情页图片是否有设置宽度，去掉重复的100%
			if(strpos($array['content'],'width="100%"')){
				$array['content']=str_replace(' width="100%"','',$array['content']);
			}
			//为img标签添加一个width
			$array['content']=str_replace('alt=""','alt="" width="100%"',$array['content']);
			if ($pid) {
				$array['photo_x'] = $pinfo['photo_x'];
				$array['photo_d'] = $pinfo['photo_d'];
				$array['photo_string'] = $pinfo['photo_string'];
			}
		  
			//上传产品小图
			if (!empty($_FILES["photo_x"]["tmp_name"])) {
					//文件上传
					$info = $this->upload_images($_FILES["photo_x"],array('jpg','png','jpeg'),"product/".date(Ymd));
				    if(!is_array($info)) {// 上传错误提示错误信息
				        $this->error($info);
				        exit();
				    }else{// 上传成功 获取上传文件信息
					    $array['photo_x'] = 'UploadFiles/'.$info['savepath'].$info['savename'];
					    $xt = M('product')->where('id='.intval($id))->field('photo_x')->find();
					    if ($id && $xt['photo_x']) {
					    	$img_url = "Data/".$xt['photo_x'];
							if(file_exists($img_url)) {
								@unlink($img_url);
							}
					    }
				    }
			}

			//上传产品大图
			if (!empty($_FILES["photo_d"]["tmp_name"])) {
					//文件上传
					$info = $this->upload_images($_FILES["photo_d"],array('jpg','png','jpeg'),"product/".date(Ymd));
				    if(!is_array($info)) {// 上传错误提示错误信息
				        $this->error($info);
				        exit();
				    }else{// 上传成功 获取上传文件信息
					    $array['photo_d'] = 'UploadFiles/'.$info['savepath'].$info['savename'];
					    $dt = M('product')->where('id='.intval($id))->field('photo_d')->find();
					    if ($id && $dt['photo_d']) {
					    	$img_url2 = "Data/".$dt['photo_d'];
							if(file_exists($img_url2)) {
								@unlink($img_url2);
							}
					    }
				    }
			}

			//多张商品轮播图上传
		  	$up_arr = array();
			if (!empty($_FILES["files"]["tmp_name"])) {
					foreach ($_FILES["files"]['name'] as $k => $val) {
						$up_arr[$k]['name'] = $val;
					}

					foreach ($_FILES["files"]['type'] as $k => $val) {
						$up_arr[$k]['type'] = $val;
					}

					foreach ($_FILES["files"]['tmp_name'] as $k => $val) {
						$up_arr[$k]['tmp_name'] = $val;
					}

					foreach ($_FILES["files"]['error'] as $k => $val) {
						$up_arr[$k]['error'] = $val;
					}

					foreach ($_FILES["files"]['size'] as $k => $val) {
						$up_arr[$k]['size'] = $val;
					}
			}
			if ($up_arr && !$pid) {
					$res=array();
					$adv_str = '';
					foreach ($up_arr as $key => $value) {
						$res = $this->upload_images($value,array('jpg','png','jpeg'),"product/".date(Ymd));
					    if(is_array($res)) {
					    	// 上传成功 获取上传文件信息保存数据库
					    	$adv_str .= ','.'UploadFiles/'.$res['savepath'].$res['savename'];
					    }
					}
					$array['photo_string'] = $adv_str;
			}
			
			//执行添加
			if(intval($id)>0){
				$imgs = M('product')->where('id='.intval($id))->getField('photo_string');
				if ($imgs && $array['photo_string']) {
					$array['photo_string'] = $imgs.$array['photo_string'];
				}
				
				//将空数据排除掉，防止将原有数据空置
				foreach ($array as $k => $v) {
					if(empty($v)){
					  	unset($v);
					}
				}

				$sql = M('product')->where('id='.intval($id))->save($array);
			}else{
				$array['addtime']=time();
				$sql = M('product')->add($array);
				$id=$sql;
			}

			//规格操作
			if($sql){//name="guige_name[]
				$this->success('操作成功.');
				exit();
			}else{
				throw new \Exception('操作失败.');
			}
			  
			}catch(\Exception $e){
				echo "<script>alert('".$e->getMessage()."');location='{:U('index')}?shop_id=".$shop_id."';</script>";
			}
		}

		//=========================
		// 查询所有一级产品分类
		//=========================
		$cate_list = M('category')->where('tid=1')->field('id,name')->select();
		$this->assign('cate_list',$cate_list);

		//=========================
		// 查询产品信息
		//=========================
		$pro_allinfo= $id>0 ? M('product')->where('id='.$id)->find() : "";
		//商场信息
		$shangchang= $pro_allinfo ? M('shangchang')->where('id='.intval($pro_allinfo['shop_id']))->find() : "";
		//产品分类
		$tid = M('category')->where('id='.intval($pro_allinfo['cid']))->getField('tid');
		$pro_allinfo['tid'] = intval($tid);
		if ($tid) {
			$catetwo = M('category')->where('tid='.intval($tid))->field('id,name')->select();
			$this->assign('catetwo',$catetwo);
		}

		//获取所有商品轮播图
		if ($pro_allinfo['photo_string']) {
			$img_str = explode(',', trim($pro_allinfo['photo_string'],','));
			$this->assign('img_str',$img_str);
		}

		//=========================
		// 查询所有品牌
		//=========================
		$brand_list = M('brand')->where('1=1')->field('id,name')->select();
		$this->assign('brand_list',$brand_list);

		//==========================
		// 将GET到的数据再输出
		//==========================
		$this->assign('id',$id);
		$this->assign('name',$name);
		$this->assign('type',$type);
		$this->assign('shop_id',$shop_id);
		$this->assign('page',$page);
		//=============
		// 将变量输出
		//=============	
		$this->assign('pro_allinfo',$pro_allinfo);
		$this->assign('shangchang',$shangchang);
		$this->display();

	}

	/*
	* 商品获取二级分类
	*/
	public function getcid(){
		$cateid = intval($_REQUEST['cateid']);
		$catelist = M('category')->where('tid='.intval($cateid))->field('id,name')->select();
		echo json_encode(array('catelist'=>$catelist));
		exit();
	}

	/*
	* 商品单张图片删除
	*/
	public function img_del(){
		$img_url = trim($_REQUEST['img_url']);
		$pro_id = intval($_REQUEST['pro_id']);
		$check_info = M('product')->where('id='.intval($pro_id).' AND del=0')->find();
		if (!$check_info) {
			echo json_encode(array('status'=>0,'err'=>'产品不存在或已下架删除！'));
			exit();
		}

		$arr = explode(',', trim($check_info['photo_string'],','));
		if (in_array($img_url, $arr)) {
			foreach ($arr as $k => $v) {
				if ($img_url===$v) {
					unset($arr[$k]);
				}
			}
			$data = array();
			$data['photo_string'] = implode(',', $arr);
			$res = M('product')->where('id='.intval($pro_id))->save($data);
			if (!$res) {
				echo json_encode(array('status'=>0,'err'=>'操作失败！'.__LINE__));
				exit();
			}
			//删除服务器上传文件
			$url = "Data/".$img_url;
			if (file_exists($url)) {
				@unlink($url);
			}

			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'操作失败！'.__LINE__));
			exit();
		}
	}

	//***************************
	//说明：产品 设置推荐
	//***************************
	public function set_tj(){
		$pro_id = intval($_REQUEST['pro_id']);
		$tj_update=M('product')->field('shop_id,type')->where('id='.intval($pro_id).' AND del=0')->find();
		if (!$tj_update) {
			$this->error('产品不存在或已下架删除！');
			exit();
		}

		//查推荐type
		//dump($tj_update);
		$data = array();
		$data['type'] = $tj_update['type']==1 ? 0 : 1;
		$up = M('product')->where('id='.intval($pro_id))->save($data);
		if ($up) {
			$this->redirect('index',array('page'=>intval($_REQUEST['page'])));
			exit();
		}else{
		    $this->error('操作失败！');
			exit();
		}
	}

	//***************************
	//说明：产品 删除
	//***************************
	public function del()
	{
		$id = intval($_REQUEST['did']);
		$info = M('product')->where('id='.intval($id))->find();
		if (!$info) {
			$this->error('产品信息错误.'.__LINE__);
			exit();
		}

		if (intval($info['del'])==1) {
			$this->success('操作成功！.'.__LINE__);
			exit();
		}

		$data=array();
		$data['del'] = $info['del'] == '1' ?  0 : 1;
		$data['del_time'] = time();
		$up = M('product')->where('id='.intval($id))->save($data);
		if ($up) {
			$this->redirect('index',array('page'=>intval($_REQUEST['page'])));
			exit();
		}else{
			$this->error('操作失败.');
			exit();
		}
	}	


	//**************************************
  	// 说明：产品字段检测
  	//**************************************
	public function check(){
		try 
		{
			
			if(self::$Array['name']==''){
				throw new \Exception('产品名字不能为空！');
			}
			
			if(self::$Array['shop_id']==''){
				throw new \Exception('请选择所属店铺！');
			}
			
			
			//验证开始时间
			/*if(self::$Array['start_time']==''){
				throw new \Exception('开始日期不能为空！');
			}else
			{
			    $start_time=@strtotime(self::$Array['start_time']);
				if(!$start_time){
					throw new \Exception('开始日期格式不正确！');
				}else{
					self::$Array['start_time'] = $start_time;
				}
			}
			
			//验证结束时间
			if(self::$Array['end_time']==''){
				throw new \Exception('结束日期不能为空！');
			}else
			{
			    $end_time=@strtotime(self::$Array['end_time']);
				if($end_time){
					$end_time+=86399;
					if($end_time<$start_time)
					{
					   throw new \Exception('结束日期不能大于开始日期！');
					}
					self::$Array['end_time'] = $end_time;
				}else{
					throw new \Exception('结束日期格式不正确！');
				}
			}*/
			
			return 1;
			
		}
		catch(\Exception $e)
		{
			$this->error_message=$e->getMessage();
			return false;
		}
    }

    //********************************
	//说明：获取产品列表
	//********************************
	public function get_pro(){
		$id=(int)$_GET['id'];

		//搜索变量
		$type=$this->htmlentities_u8($_GET['type']);
		$tuijian=$this->htmlentities_u8($_GET['tuijian']);
		$name=$this->htmlentities_u8($_GET['name']);

		//===========================================
		// 产品列表信息 搜索
		//===========================================
		$where="1=1 AND pro_type=1 AND del<1";

		if (intval($_SESSION['admininfo']['qx'])!=4) {
			$shop_id = intval($_SESSION['admininfo']['shop_id']);
			if (!$shop_id) {
				echo "<script>alert('店铺状态异常！');</script>";
				exit();
			}
			$where .=' AND shop_id='.$shop_id;
		}

		$tuijian!=='' ? $where.=" AND type=$tuijian" : null;
		$name!='' ? $where.=" AND name like '%$name%'" : null;
		define('rows',20);
		$count=M('product')->where($where)->count();
		$rows=ceil($count/rows);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$page_index=$this->page_index($count,$rows,$page);
		$productlist=M('product')->where($where)->order('addtime desc,id desc')->limit($limit,rows)->select();
		//dump($productlist);exit;
		foreach ($productlist as $k => $v) {
			$productlist[$k]['cat_name']= M('category')->where('id='.intval($v['cid']))->getField('name');
		}

		//==========================
		// 将GET到的数据再输出
		//==========================
		$this->assign('id',$id);
		$this->assign('tuijian',$tuijian);
		$this->assign('name',$name);
		$this->assign('type',$type);
		$this->assign('page',$page);
		//=============
		// 将变量输出
		$this->assign('productlist',$productlist);
		$this->assign('page_index',$page_index);
		$this->display();
	}
}