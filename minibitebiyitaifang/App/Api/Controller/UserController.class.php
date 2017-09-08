<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class UserController extends PublicController {
	
	Public function verify(){
	    $image = new \Org\Util\Image;
	    $image->buildImageVerify();
    }

	//***************************
	//  获取用户订单数量
	//***************************
	public function getorder(){
		$uid = intval($_REQUEST['userId']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'非法操作.'));
			exit();
		}
		//检测用户是否开通了店铺，如果开通了则返回1，否则返回0；
		$checkusershop=M('user')->where("id=".$uid." AND del=0")->getField('shop_status');
		if($checkusershop==1){
			$check=1;//表示开通
		}else{
			$check=0;//表示未开通
		}
		$order = array();
		$order['pay_num'] = intval(M('order')->where('uid='.intval($uid).' AND status=10 AND del=0')->getField('COUNT(id)'));
		$order['Has_Sum'] = intval(M('order')->where('uid='.intval($uid).' AND status=20 AND del=0')->getField('COUNT(id)'));
		$order['rec_num'] = intval(M('order')->where('uid='.intval($uid).' AND status=30 AND del=0 AND back="0"')->getField('COUNT(id)'));
		$order['finish_num'] = intval(M('order')->where('uid='.intval($uid).' AND status>30 AND del=0 AND back="0"')->getField('COUNT(id)'));
		$order['refund_num'] = intval(M('order')->where('uid='.intval($uid).' AND back>"0"')->getField('COUNT(id)'));
		echo json_encode(array('status'=>1,'orderInfo'=>$order,'shop_status'=>$check));
		exit();
	}

	public function findfwd_edit(){
		$name    = $_POST['name'];
		$tel     = $_POST['tel'];
		$newpwd  = $_POST['newpwd'];
		$newpwds = $_POST['newpwds'];
		if(empty($name)){
            $this->error('请输入用户名',U('User/findfwd',array('key'=>$_REQUEST['key'])));
		}
		if(empty($tel)){
            $this->error('请输入手机号',U('User/findfwd',array('key'=>$_REQUEST['key'])));
		}
		if($newpwd!=$newpwds){
			$this->error('两次密码输入不同',U('User/findfwd',array('key'=>$_REQUEST['key'])));
		}else{
			$name = $_REQUEST['name'];	    //帐号
			$tel = $_REQUEST['tel'];		//接受短信用户
			$yzm = $_REQUEST['yzm'];		//验证码
			$data['pwd'] = md5(md5($_REQUEST['newpwd'])); //新密码
			$sms_o = file_get_contents('Public/Rand/'.$tel.'.txt');
	        if($sms_o!=$yzm){
				$this->error('验证码错误！',U('User/findfwd',array('key'=>$_REQUEST['key'])));
	        }else{
				$result=M("user")->where('name = "'.$name.'"')->save($data);
				if($result !== false){
					$this->success('修改成功！',U('User/logo',array('key'=>$_REQUEST['key'])));
				}else{
					$this->error('修改失败！',U('User/logo',array('key'=>$_REQUEST['key'])));
				}
	        }
		}
	}

	/**
	 * [userinfo 获取用户信息]
	 * @return [type] [description]
	 */
	public function userinfo(){
		$uid = I('request.uid');
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'请求失败.'));
			exit();
		}

		$user = M("user")->where('id='.$uid)->find();
		$img = array();
		$img2 = array();
		if($user['img']){
			$img = explode(',',trim($user['img'],','));
		}
		if($img){
			foreach($img as $k => $v){
				$img2[$k] = 'http://'.$_SERVER['SERVER_NAME'].__DATA__.'/'.$v;
			}
		}
		
		echo json_encode(array('status'=>1,'userinfo'=>$user,'img'=>$img,'img2'=>$img2));
		exit();
	}

	

	//***************************
	//  用户反馈接口
	//***************************
	public function feedback(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
			exit();
		}

		$con = $_POST['con'];
		if (!$con) {
			echo json_encode(array('status'=>0,'err'=>'请输入反馈内容.'));
			exit();
		}
		$data = array();
		$data['uid'] = $uid;
		$data['message'] = $con;
		$data['addtime'] = time();
		$res = M('fankui')->add($data);
		if ($res) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'保存失败！'));
			exit();
		}

	}

	//***************************
	//  用户商品收藏信息
	//***************************
	public function collection(){
		$user_id = intval($_REQUEST['id']);
		if (!$user_id) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$pro_sc = M('product_sc');
		$count = $pro_sc->where('uid='.intval($user_id))->count();// 查询满足要求的总记录数
		$Page  = new \Org\Util\Page($count,10);// 实例化分页类 传入总记录数和每页显示的记录数
		$show  = $Page->show();// 分页显示输出
		
		$sc_list = $pro_sc->where('uid='.intval($user_id))->order('id desc')->select();
		foreach ($sc_list as $k => $v) {
			$pro_info = M('product')->where('id='.intval($v['pid']).' AND del=0 AND is_down=0')->find();
			if ($pro_info) {
				$sc_list[$k]['pro_name'] = $pro_info['name'];
				$sc_list[$k]['photo'] = 'http://'.$_SERVER['SERVER_NAME'].__DATA__.'/'.$pro_info['photo_x'];
				$sc_list[$k]['price'] = number_format($pro_info['price'],2);
				$sc_list[$k]['price_yh'] = number_format($pro_info['price_yh'],2);
				$sc_list[$k]['shiyong'] = intval($pro_info['shiyong']);
				$sc_list[$k]['renqi'] = intval($pro_info['renqi']);
			}else{
				$pro_sc->where('id='.intval($v['id']))->delete();
			}
		}

		echo json_encode(array('status'=>1,'sc_list'=>$sc_list));
		exit();
	}

	//***************************
	//  用户单个商品取消收藏
	//***************************
	public function collection_qu(){
	    $sc_id = intval($_REQUEST['id']);
    	if (!$sc_id) {
    		echo json_encode(array('status'=>0,'err'=>'非法操作.'));
    		exit();
    	}

		$product=M("product_sc");
	    $ress = $product->where('id ='.intval($sc_id))->delete(); 
	   //echo $shangchang->_sql();
		if($ress){
		    echo json_encode(array('status'=>1));
		    exit();
		}else{
		    echo json_encode(array('status'=>0,'err'=>'网络异常！'.__LINE__));
		    exit();
	    }
	}


	//***************************
	//  用户单个店铺取消收藏
	//***************************
    public function unfollow(){
    	$sc_id = intval($_REQUEST['id']);
    	if (!$sc_id) {
    		echo json_encode(array('status'=>0,'err'=>'非法操作.'));
    		exit();
    	}
		//取消关注店铺
		$shangchang=M("shangchang_sc");
	    $ress = $shangchang->where('id ='.intval($sc_id))->delete(); 
	   // echo $shangchang->_sql();
		if($ress){
		    echo json_encode(array('status'=>1));
		    exit();
		}else{
		    echo json_encode(array('status'=>0,'err'=>'网络异常！'.__LINE__));
		    exit();
	    }
		
	}

	//***************************
	//  获取用户店铺收藏数据
	//***************************
	public function shangchang(){
		//关注店铺
		$user_id = intval($_REQUEST['user_id']);
		if (!$user_id) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$shangchang=M("shangchang_sc");
		$count      = $shangchang->where('uid='.intval($user_id))->count();// 查询满足要求的总记录数
		$Page       = new \Org\Util\Page($count,4);// 实例化分页类 传入总记录数和每页显示的记录数
		$show       = $Page->show();// 分页显示输出
		
		$sc_list = $shangchang->where('uid='.intval($user_id))->order('id desc')->select();
		foreach ($sc_list as $k => $v) {
			$sc_info = M('shangchang')->where('id='.intval($v['shop_id']))->find();
			if ($sc_info) {
				$sc_list[$k]['shop_name'] = $sc_info['name'];
				$sc_list[$k]['uname'] = $sc_info['uname'];
				$sc_list[$k]['logo'] = 'http://'.$_SERVER['SERVER_NAME'].__DATA__.'/'.$sc_info['logo'];
				$sc_list[$k]['tel'] = $sc_info['tel'];
				$sc_list[$k]['sheng'] = M('china_city')->where('id='.intval($sc_info['sheng']))->getField('name');
				$sc_list[$k]['city'] = M('china_city')->where('id='.intval($sc_info['city']))->getField('name');
				$sc_list[$k]['quyu'] = M('china_city')->where('id='.intval($sc_info['quyu']))->getField('name');
			}else{
				$shangchang->where('id='.intval($v['id']))->delete();
			}
		}

		echo json_encode(array('status'=>1,'sc_list'=>$sc_list));
		exit();
	}

	//*****************************
	//
	// h5头像上传
	//******************************
	public function uploadify(){
		$imgtype = array(
		  'gif'=>'gif',
		  'png'=>'png',
		  'jpg'=>'jpg',
		  'jpeg'=>'jpeg'
		); //图片类型在传输过程中对应的头信息
		$message = $_POST['message']; //接收以base64编码的图片数据
		$filename = $_POST['filename']; //自定义文件名称
		$ftype = $_POST['filetype']; //接收文件类型
		//首先将头信息去掉，然后解码剩余的base64编码的数据
		$message = base64_decode(substr($message,strlen('data:image/'.$imgtype[strtolower($ftype)].';base64,')));
		$filename2 = $filename.".".$ftype;
		$furl = "./Data/UploadFiles/user_img/".date("Ymd");
		if (!is_dir($furl)) {
			@mkdir($furl, 0777);
		}
		$furl = $furl.'/';

		//开始写文件
		$file = fopen($furl.$filename2,"w");
		if(fwrite($file,$message) === false){
		  echo json_encode(array('status'=>0,'err'=>'failed'));
		  exit;
		}

		////图片URL地址
		$pic_url = $furl.$filename2;
		//$pic_url = "./Data/UploadFiles/user_img/20170115/0.jpeg";
		$image = new \Think\Image();
	    $image->open($pic_url);
	    // 生成一个居中裁剪为150*150的缩略图并保存为thumb.jpg
	    $image->thumb(100, 100,\Think\Image::IMAGE_THUMB_SCALE)->save($pic_url);
	    /*echo $pic_url;
	    exit();*/

	    $uid = intval($_REQUEST['uid']);
	    if (!$uid) {
	    	echo json_encode(array('status'=>0,'err'=>'登录状态异常！error'));
	    	exit();
	    }
	    //获取原来的头像链接
	    $oldpic = M('user')->where('id='.intval($uid))->getField('photo');
	    $oldpic2 = './Data/'.$oldpic;

	    $data =array();
	    $data['photo'] = "UploadFiles/user_img/".date("Ymd").'/'.$filename2;
	    $up = M('user')->where('id='.intval($uid))->save($data);
	    if ($up) {
	    	//如果原头像存在就删除
	    	if ($oldpic && file_exists($oldpic2)) {
	    		@unlink($oldpic2);
	    	}
	    	echo json_encode(array('status'=>1,'urls'=>'Data/'.$data['photo']));
	    	exit();
	    }else{
	    	echo json_encode(array('status'=>0,'err'=>'头像保存失败.'));
			exit();
	    }
		
    }

    //***************************
	//  用户修改密码接口
	//***************************
	public function forget_pwd(){
		$user_name = trim($_REQUEST['username']);
		$tel = trim($_REQUEST['tel']);
		if (!$user_name || !$tel) {
			echo json_encode(array('status'=>0,'err'=>'请输入账号或手机号.'));
			exit();
		}

		$where=array();
		$where['name']=$user_name;
		$where['tel'] = $tel;
		$check = M('user')->where($where)->count();
		if ($check) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'账号不存在.'));
			exit();
		}
	}

	//***************************
	//  用户修改密码接口
	//***************************
	public function up_pwd(){
		$psw = trim($_POST['psw']);
		if (!$psw) {
			echo json_encode(array('status'=>0,'err'=>'请输入新密码.'));
			exit();
		}
		$user_name = trim($_POST['user']);
		$tel = trim($_POST['tel']);
		if (!$user_name || !$tel) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$where=array();
		$where['name']=$user_name;
		$where['tel'] = $tel;
		$pwd = md5(md5($psw));
		$up = M('user')->where($where)->save(array('pwd'=>$pwd));
		if ($up) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'账号不存在.'));
			exit();
		}
	}

	//***************************
	//  获取用户优惠券
	//***************************
	public function voucher(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常！'.__LINE__));
			exit();
		}

		//获取未使用或者已失效的优惠券
		$nouse = array();$nouses = array();$offdate = array();$offdates = array();
		$vou_list = M('user_voucher')->where('uid='.intval($uid).' AND status!=2')->select();
		foreach ($vou_list as $k => $v) {
			$vou_info = M('voucher')->where('id='.intval($v['vid']))->find();
			if (intval($vou_info['del'])==1 || $vou_info['end_time']<time()) {
				$offdate['vid'] = intval($vou_info['id']);
				$offdate['full_money'] = floatval($vou_info['full_money']);
				$offdate['amount'] = floatval($vou_info['amount']);
				$offdate['start_time'] = date('Y.m.d',intval($vou_info['start_time']));
				$offdate['end_time'] = date('Y.m.d',intval($vou_info['end_time']));
				$offdates[] = $offdate;
			}elseif ($vou_info['end_time']>time()) {
				$nouse['vid'] = intval($vou_info['id']);
				$nouse['shop_id'] = intval($vou_info['shop_id']);
				$nouse['title'] = $vou_info['title'];
				$nouse['full_money'] = floatval($vou_info['full_money']);
				$nouse['amount'] = floatval($vou_info['amount']);
				if ($vou_info['proid']=='all' || empty($vou_info['proid'])) {
	                $nouse['desc'] = '店内通用';
	            }else{
	                $nouse['desc'] = '限定商品';
	            }
				$nouse['start_time'] = date('Y.m.d',intval($vou_info['start_time']));
				$nouse['end_time'] = date('Y.m.d',intval($vou_info['end_time']));
				if ($vou_info['proid']) {
					$proid = explode(',', $vou_info['proid']);
					$nouse['proid'] = intval($proid[0]);
				}
				$nouses[] = $nouse;
			}
		}

		////获取已使用的优惠券
		$used = array();$useds = array();
		$vouusedlist = M('user_voucher')->where('uid='.intval($uid).' AND status=2')->select();
		foreach ($vouusedlist as $k => $v) {
			$vou_info = M('voucher')->where('id='.intval($v['vid']))->find();
			$used['vid'] = intval($vou_info['id']);
			$used['full_money'] = floatval($vou_info['full_money']);
			$used['amount'] = floatval($vou_info['amount']);
			$used['start_time'] = date('Y.m.d',intval($vou_info['start_time']));
			$used['end_time'] = date('Y.m.d',intval($vou_info['end_time']));
			$useds[] = $used;
		}

		echo json_encode(array('status'=>1,'offdates'=>$offdates,'nouses'=>$nouses,'useds'=>$useds));
		exit();
	}

	/**
	 * [edituser 修改用户信息]
	 * @return [type] [description]
	 */
	public function edituser(){
		$time=mktime();
		$uid=I('request.uid');
		if(!$uid){
			echo json_encode(array('status'=>0,'err'=>'请求失败！'));
			exit();
		}
		$arr['tel']=I('request.tel');
		$arr['tel2']=I('request.tel2');
		$arr['email']=I('request.email');
		$arr['shengri']=I('request.shengri');
		$arr['sex']=I('request.sex');
		$arr['company']=I('request.company');
		$arr['job']=I('request.job');
		$arr['uname']=I('request.uname');
		$arr['address']=I('request.address');
		$arr['intro']=I('request.intro');
		$arr['type']=1;
		// $arr['img'] = I('request.img');
		// $arr['img'] = str_replace('http://'.$_SERVER['SERVER_NAME'].__DATA__.'/','',$arr['img']);

		$user_info = M('user')->where('id='.$uid.' AND del=0')->find();
		if (!$user_info) {
			echo json_encode(array('status'=>0,'err'=>'会员信息错误！'));
			exit();
		}
		//用户手机号检测
		if ($arr['tel']) {
			if(!$this->isMobile($arr['tel'])){
				echo json_encode(array('status'=>0,'err'=>'请填写正确的手机号码!'));
				exit();
			}
			$check_tel = M('user')->where('tel='.$arr['tel'].' AND del=0 AND id!='.$uid)->count();
			if ($check_tel) {
				echo json_encode(array('status'=>0,'err'=>'手机号已被绑定！'));
				exit();
			}
		}

		$result=M("user")->where('id='.$uid.' AND del=0')->save($arr);
	   
		echo json_encode(array('status'=>1));
		exit();
		
	}

	//修改个人信息显示方式 隐藏或显示
	public function change_show(){
		$uid = intval($_REQUEST['uid']);
		$is_show = intval($_REQUEST['is_show']);
		$data['is_show'] = $is_show;
		$res = M('user')->where('id='.$uid)->save($data);
		if($res){
			echo json_encode(array('status'=>1,'err'=>'设置成功！'));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'网络错误！'));
			exit();
		}
	}

	/**
	 * [getShopOrderNum 获得商家待处理订单数量]
	 * @return [type] [description]
	 */
	public function getShopOrderNum(){
		$uid=I('request.uid');
		if(!$uid){
			echo json_encode(array('status'=>0,'err'=>'请求失败！'));
			exit();
		}
		$shopid=M("user")->where("id=$uid")->getField("shop_id");
		$re=M("order")->where("shop_id=$shopid AND status=20")->count();
		if($re){
			echo json_encode(array('status'=>1,'err'=>$re));
		}else{
			echo json_encode(array('status'=>1,'err'=>0));
		}

	}
	/**
	 * [getShopOrder 获取商家的订单情况]
	 * @return [type] [description]
	 */
	public function getShopOrder(){
		$uid=I('request.uid');
		if(!$uid){
			echo json_encode(array('status'=>0,'err'=>'请求失败！'));
			exit();
		}
		$user=M("user");
		$status=array(
			"0"=>"已取消",
			"10"=>"未付款",
			"20"=>"待发货",
			"30"=>"待收货",
			"40"=>"待评价",
			"50"=>"交易完成"
		);
		$shopid=M("user")->where("id=$uid")->getField("shop_id");
		$list['deliver']=M("order")->where("shop_id=$shopid AND status=20")->select();
		foreach ($list['deliver'] as $k => $v) {
			$list['deliver'][$k]['username']=$user->where("id=".$v['uid'])->getField("name");
			$list['deliver'][$k]['addtime']=date("Y-m-d H:i:s",$v['addtime']);
			$list['deliver'][$k]['status']=$status[$v['status']];
		}
		$list['finish']=M("order")->where("shop_id=$shopid AND status>20 AND status<51")->select();
		foreach ($list['finish'] as $k => $v) {
			$list['finish'][$k]['username']=$user->where("id=".$v['uid'])->getField("name");
			$list['finish'][$k]['addtime']=date("Y-m-d H:i:s",$v['addtime']);
			$list['finish'][$k]['status']=$status[$v['status']];
		}

		echo json_encode(array("status"=>1,"err"=>$list));
	}
	//***************************
	//  用户 接单
	//***************************
	public function orders(){
		$uid = intval($_REQUEST['uid']);
		$sid = intval($_REQUEST['sid']);
		if (!$uid || !$sid) {
			echo json_encode(array('status'=>0,'err'=>'参数错误.'));
			exit();
		}

		$userinfo = M('user')->where('del=0 AND id='.intval($uid))->find();
		if (!$userinfo) {
			echo json_encode(array('status'=>0,'err'=>'用户信息错误.'));
			exit();
		}
		if ($userinfo['shop_status']==0 || $userinfo['rztype']=='normal') {
			echo json_encode(array('status'=>0,'err'=>'您还未认证,不能进行接单噢!'));
			exit();
		}

		$check = M('supply')->where('id='.intval($sid))->find();
		if (intval($check['state'])!=0) {
			echo json_encode(array('status'=>0,'err'=>'供求信息异常！'));
			exit();
		}

		if (intval($check['uid'])==intval($uid)) {
			echo json_encode(array('status'=>0,'err'=>'无法接自己发布的单噢！'));
			exit();
		}

		

		$up = array();
		$up['rec_id'] = $uid;
		$up['rec_time'] = time();
		$up['state'] = 1;
		$res = M('supply')->where('id='.intval($sid))->save($up);
		if ($res) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'接单失败，请稍后再试！'));
			exit();
		}
	}

	//***************************
	//  用户 接单
	//***************************
	public function contact(){
		$uid = intval($_REQUEST['uid']);
		$sid = intval($_REQUEST['id']);
		if (!$uid || !$sid) {
			echo json_encode(array('status'=>0,'err'=>'参数错误.'));
			exit();
		}

		$userinfo = M('user')->where('del=0 AND id='.intval($uid))->find();
		if (!$userinfo) {
			echo json_encode(array('status'=>0,'err'=>'用户信息错误.'));
			exit();
		}

		$check = M('supply')->where('id='.intval($sid))->find();
		if (intval($check['state'])!=0) {
			echo json_encode(array('status'=>0,'err'=>'供求信息异常！'));
			exit();
		}

		// if (intval($check['uid'])==intval($uid)) {
		// 	echo json_encode(array('status'=>0,'err'=>'状态异常！'));
		// 	exit();
		// }

		if ($userinfo['shop_status']==0 || $userinfo['rztype']=='normal') {
			echo json_encode(array('status'=>0,'err'=>'您还未认证,不能进行接单噢!'));
			exit();
		}

		// if (intval($userinfo['audit'])!=2) {
		// 	echo json_encode(array('status'=>0,'err'=>'企业认证审核中...'));
		// 	exit();
		// }

		$up = array();
		$up['rec_id'] = $uid;
		$up['rec_time'] = time();
		$up['state'] = 1;
		$res = M('supply')->where('id='.intval($sid))->save($up);
		if ($res) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'接单失败，请稍后再试！'));
			exit();
		}
	}

	//***************************
	//  用户 发布供求
	//***************************
	public function supply(){
		$uid = intval($_REQUEST['uid']);
		$dtype = intval($_REQUEST['dtype']);
		if (!$uid || !$dtype) {
			echo json_encode(array('status'=>0,'err'=>'参数错误.'));
			exit();
		}

		$content = trim($_POST['content']);
		if (!$content) {
			echo json_encode(array('status'=>0,'err'=>'请输入供求内容.'));
			exit();
		}

		$userinfo = M('user')->where('del=0 AND id='.intval($uid))->find();
		if (!$userinfo) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}
		if(!$userinfo['tel']){
			echo json_encode(array('status'=>0,'err'=>'请到个人信息完善您的手机号码!'));exit;
		}

		if($dtype==1){
			if ($userinfo['shop_status']==0 || $userinfo['rztype']=='normal') {
				echo json_encode(array('status'=>0,'err'=>'您还未认证,不能进行发布供应噢!'));
				exit();
			}	
		}

		if (!$userinfo['tel']) {
			echo json_encode(array('status'=>0,'err'=>'请先去个人中心绑定您的手机号.'));
			exit();
		}

		$add = array();
		$add['uid'] = $uid;
		$add['content'] = $content;
		$add['phone'] = M('user')->where('id='.intval($uid))->getField('tel');
		$add['type'] = $dtype;
		$catid=explode("-",I("request.category"));
        $add['cid']=$catid[0];
		$add['area']=I("request.area");
		$add['addtime'] = time();
		$res = M('supply')->add($add);
		if ($res) {
			echo json_encode(array('status'=>1,'err'=>"发布成功!"));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'发布失败！'));
			exit();
		}
	}

	//***************************
	//  用户 我的供应
	//***************************
	public function my_supply(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$supply = M('supply');
		$state = array('0'=>'供求中','1'=>'有人接单','2'=>'已取消','3'=>'达成合作');
        $gong = $supply->where('type=1 AND uid='.intval($uid))->order('addtime desc')->select();
        foreach ($gong as $k => $v) {
            $gong[$k]['addtime'] = date("Y-m-d",$v['addtime']);
            if ($v['rec_id']) {
            	$gong[$k]['rec_name'] = M('user')->where('id='.intval($v['rec_id']))->getField('truename');
            	$gong[$k]['rec_phone'] = M('user')->where('id='.intval($v['rec_id']))->getField('tel');
            }else{
            	$gong[$k]['rec_name'] = '暂无';
            	$gong[$k]['rec_phone'] = '暂无';
            }
            $gong[$k]['desc'] = $state[$v['state']];
        }
        echo json_encode(array('status'=>1,'list'=>$gong));
		exit();
	}

	//***************************
	//  用户 我的求购
	//***************************
	public function my_qiu(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$supply = M('supply');
		$state = array('0'=>'求购中','1'=>'已联系','2'=>'已取消','3'=>'达成合作');
        $qiu = $supply->where('type=2 AND uid='.intval($uid))->order('addtime desc')->select();
        foreach ($qiu as $k => $v) {
            $qiu[$k]['addtime'] = date("Y-m-d",$v['addtime']);
            if ($v['rec_id']) {
            	$qiu[$k]['rec_name'] = M('user')->where('id='.intval($v['rec_id']))->getField('name');
            	$qiu[$k]['rec_phone'] = M('user')->where('id='.intval($v['rec_id']))->getField('tel');
            }else{
            	$qiu[$k]['rec_name'] = '暂无';
            	$qiu[$k]['rec_phone'] = '暂无';
            }
            $qiu[$k]['desc'] = $state[$v['state']];
        }
        echo json_encode(array('status'=>1,'list'=>$qiu));
		exit();
	}
	public function qiugou_del(){
		$uid = I("request.uid");
		$id=I("request.id");

		if (!$uid || !$id) {
			echo json_encode(array('status'=>0,'err'=>'参数不足'));
			exit();
		}
		$re=M("supply")->where("id=$id AND uid=$uid")->delete();
		if($re){
			echo json_encode(array('status'=>1,'err'=>'取消成功!'));
		}else{
			echo json_encode(array('status'=>0,'err'=>'取消失败!'));
		}
	}
	public function gongying_del(){
		$uid = I("request.uid");
		$id=I("request.id");

		if (!$uid || !$id) {
			echo json_encode(array('status'=>0,'err'=>'参数不足'));
			exit();
		}
		$re=M("supply")->where("id=$id AND uid=$uid")->delete();
		if($re){
			echo json_encode(array('status'=>1,'err'=>'取消成功!'));
		}else{
			echo json_encode(array('status'=>0,'err'=>'取消失败!'));
		}
	}
	//***************************
	//  用户 我的供应
	//***************************
	public function shop_supply(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$supply = M('supply');
		$state = array('0'=>'供求中','1'=>'已接单','2'=>'已取消','3'=>'达成合作');
        $gong = $supply->where('type=1 AND uid='.intval($uid))->order('addtime desc')->select();
        foreach ($gong as $k => $v) {
            $gong[$k]['rec_time'] = date("Y-m-d",$v['rec_time']);
            $gong[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
            if (!$gong[$k]['rec_name']) {
            	$gong[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('uname');
            }
            $gong[$k]['rec_phone'] = M('user')->where('id='.intval($v['uid']))->getField('tel');
            $gong[$k]['desc'] = $state[$v['state']];
        }
        echo json_encode(array('status'=>1,'list'=>$gong));
		exit();
	}
	/**
	 * [shop_supply 接单管理]
	 * @return [type] [description]
	 */
	public function shop_supply_charge(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$supply = M('supply');
		$state = array('0'=>'供求中','1'=>'已接单','2'=>'已取消','3'=>'达成合作');
        $gong = $supply->where('type=2 AND rec_id='.intval($uid))->order('addtime desc')->select();
        foreach ($gong as $k => $v) {
            $gong[$k]['rec_time'] = date("Y-m-d",$v['rec_time']);
            $gong[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('name');
            if (!$gong[$k]['rec_name']) {
            	$gong[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('uname');
            }
            $gong[$k]['rec_phone'] = M('user')->where('id='.intval($v['uid']))->getField('tel');
            $gong[$k]['desc'] = $state[$v['state']];
        }
        echo json_encode(array('status'=>1,'list'=>$gong));
		exit();
	}
	//***************************
	//  用户 我的求购
	//***************************
	public function shop_qiu(){
		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'用户信息异常.'));
			exit();
		}

		$supply = M('supply');
		$state = array('0'=>'求购中','1'=>'已联系','2'=>'已取消','3'=>'达成合作');
        $qiu = $supply->where('type=2 AND rec_id='.intval($uid))->order('addtime desc')->select();
        foreach ($qiu as $k => $v) {
            $qiu[$k]['rec_time'] = date("Y-m-d",$v['rec_time']);
            $qiu[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('truename');
            if (!$qiu[$k]['rec_name']) {
            	$qiu[$k]['rec_name'] = M('user')->where('id='.intval($v['uid']))->getField('uname');
            }
            $qiu[$k]['rec_phone'] = M('user')->where('id='.intval($v['uid']))->getField('tel');
            $qiu[$k]['desc'] = $state[$v['state']];
        }
        echo json_encode(array('status'=>1,'list'=>$qiu));
		exit();
	}


	//***************************
	//  用户 我的求购
	//***************************
	public function up_state(){
		$uid = intval($_REQUEST['uid']);
		$sid = intval($_REQUEST['id']);
		if (!$uid || !$sid) {
			echo json_encode(array('status'=>0,'err'=>'参数错误.'.__LINE__));
			exit();
		}
		$ztype = trim($_REQUEST['ztype']);

		$supply = M('supply');
		$check = $supply->where('id='.intval($sid))->find();
		if (!$check) {
			echo json_encode(array('status'=>0,'err'=>'供求信息异常！.'.__LINE__));
			exit();
		}

		$up = array();
		if ($ztype=='hz') {
			$up['state'] = 3;
			if (intval($check['state'])==3) {
				echo json_encode(array('status'=>1));
				exit();
			}
		}elseif($ztype=='qx'){
			if (intval($check['state'])==2) {
				echo json_encode(array('status'=>1));
				exit();
			}
			$up['state'] = 0;
			$up['rec_id'] = 0;
		}else{
			echo json_encode(array('status'=>0,'err'=>'操作失败！.'.__LINE__));
			exit();
		}

		$res = $supply->where('id='.intval($sid))->save($up);
		if ($res) {
			echo json_encode(array('status'=>1));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'操作失败！.'.__LINE__));
			exit();
		}
	}

	//***************************
	//  用户 上传图片
	//***************************
	public function uploadimg(){
		// dump($_REQUEST['uid']);
		$info = $this->upload_images($_FILES['data'],array('jpg','png','jpeg'),"personImg/".date(Ymd));
		if(is_array($info)) {// 上传错误提示错误信息
			$url = 'UploadFiles/'.$info['savepath'].$info['savename'];
			if ($_REQUEST['imgurl']) {
				$img_url = "Data/".$_REQUEST['imgurl'];
				if(file_exists($img_url)) {
					@unlink($img_url);
				}
			}
			echo $url;
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>$info));
			exit();
		}
	}

	//更新数据库
	public function saveImg(){
		$uid = intval($_REQUEST['uid']);
		$img_url = $_REQUEST['img_url'];
		$img = M('user')->where('id='.$uid)->getField('img');
		$data['img'] = $img.','.$img_url;
		$res = M('user')->where('id='.$uid)->save($data);
		if($res){
			echo json_encode(array('status'=>1,'err'=>'上传成功！'));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'上传失败！'));
			exit();
		}
	}

	/**
	 * [userinfo 删除图片]
	 * @return [type] [description]
	 */
	public function delimg(){
		$uid = I('request.uid');
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'请求失败.'));
			exit();
		}
		$img_url = $_REQUEST['img_url'];
		$img = M('user')->where('id='.intval($uid))->getField('img');
		if($img){
			$img = explode(',',trim($img,','));
				foreach ($img as $k => $v) {
					if ($img_url===$v) {
						unset($img[$k]);
						$data['img'] = implode(',', $img);
						$tmp = M('user')->where('id='.intval($uid))->save($data);
						if($tmp){
							$url = "Data/".$img_url;
							if (file_exists($url)) {
								@unlink($url);
							}
						}
						
					}
				}			
				
				echo json_encode(array('status'=>1,'img'=>$img));
				exit();	
			
		}else{
			echo json_encode(array('status'=>0,'err'=>'网络异常！'));
			exit();
		}
		
		
	}
		
	/*
	*
	* 图片上传的公共方法
	*  $file 文件数据流 $exts 文件类型 $path 子目录名称
	*/
	public function upload_images($file,$exts,$path){
		$upload = new \Think\Upload();// 实例化上传类
		$upload->maxSize   =  2097152 ;// 设置附件上传大小2M
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

	public function getqrcode(){
        $uid=I("request.uid");
        if(!$uid){
            echo json_encode(array("status"=>0,"err"=>"参数不足!"));exit;
        }
        
        $qrcode=M("user")->where("id=$uid")->getField("qrcode");
        if($qrcode){
            echo json_encode(array("status"=>1,"err"=>__DATAURL__.$qrcode));
        }else{
            echo json_encode(array("status"=>0,"err"=>"您还没有您的小程序码!是否要生成个人专属小程序码?"));
        }                   
    }
    /**
     * [makeqrcode 生成二维码]
     * @return [type] [description]
     */
    public function makeqrcode(){
        $uid=I("request.uid");
        if(!$uid){
            echo json_encode(array("status"=>0,"err"=>"参数不足!"));exit;
        }

        $access_token=$this->_getAccessToken();
        //2
        $path="pages/personal/personal?linkshipID=".intval($uid);
        $width=430;
        $post_data='{"path":"'.$path.'","width":'.$width.'}'; 
        //$post_data='{"scene":"'.$uid.'","width":'.$width.'}'; 
        $url="https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=".$access_token;
        //$url="http://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=".$access_token;
        $result=$this->api_notice_increment($url,$post_data);
        //3
        $newFilePath='UploadFiles/user_img/qrcode_'.$uid.'_'.date("Ymd",time()).'.jpg';
        if(empty($result)){
            $result=file_get_contents("php://input");
        }
        $newFile = fopen("Data/".$newFilePath,"w");//打开文件准备写入
        fwrite($newFile,$result);//写入二进制流到文件
        fclose($newFile);//关闭文件
        M("user")->where("id=$uid")->setField("qrcode",$newFilePath);
        echo json_encode(array("status"=>1,"err"=>__DATAURL__.$newFilePath));
    }
}
