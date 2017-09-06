<?php
namespace Shop\Controller;
use Think\Controller;

class LoginController extends PublicController{
	//********************
	//登录
	//********************
	public function index(){
		if(IS_POST){
			$username=trim($_POST['username']);
			$admininfo=M('user')->where("name='$username' AND del<1 AND shop_status=1")->find();
			if($admininfo){
				if(MD5(MD5($_POST['pwd']))==$admininfo['pwd']){
					$shop_id = intval($admininfo['shop_id']);
					$shop_info = M('shangchang')->where('id='.intval($shop_id).' AND status=1')->find();
					if (!$shop_info) {
						$this->error('店铺信息异常，请联系平台客服人员！');
						exit();
					}
					$shop = array();
					$shop['shop_id'] = $shop_info['id'];
					$shop['logo'] = $shop_info['logo'];
					$shop['name'] = $shop_info['name'];
					$shop['addtime'] = date('Y-m-d H:i',$shop_info['addtime']);
					$shop['uname'] = $shop_info['uname'];
					$shop['tel'] = $shop_info['tel'];
					$shop['address_xq'] = $shop_info['address_xq'];

 					unset($_SESSION['admininfo']);
 					unset($_SESSION['shopinfo']);
					$_SESSION['admininfo']=$admininfo;
					$_SESSION['shopinfo']=$shop;
					$this->success('登陆成功!',U('Index/index'));
					exit();		
				}else{
					$this->error('账号密码错误');
					exit();
				}
			}else{
				$this->error('账号不存在或已注销');
				exit();
			}
		}else{
			$this->display();
		}
	}

	public function logout(){
		unset($_SESSION['admininfo']);
		unset($_SESSION['shopinfo']);
		$this->success('注销成功!',U('Login/index'));
		exit;
	}	
}