<?php
namespace Api\Controller;
use Think\Controller;
class PayController extends PublicController{
	/**
	 * 微信支付接口
	 *   {"appid":"wx0411fa6a39d61297","noncestr":"3reA4pSqGBPPryEL","package":"Sign=WXPay","partnerid":"1230636401","prepayid":"wx20170406175858b261288c050041764688","timestamp":1491472738,"sign":"4A50B67D47E062A1F3B739D76C683D37"}
	 *  appid
	 *  noncestr
	 *  package
	 *  partnerid
	 *  prepayid
	 *  timestamp
	 *  sign
	 */
    public function dowxpay(){
    	//引入文件
    	header('Access-Control-Allow-Origin: *');
		header('Content-type: text/plain');
		vendor("wxpay.wxpay");
		//支付完成后的回调处理页面
		$notify_url = C("wxpay.wx_notify_url");
		//$notify_url = "https://gzleren.com/dushiw/index.php/Api/Pay/wxnotifyurl";

		$uid = intval($_REQUEST['uid']);
		if (!$uid) {
			echo json_encode(array('status'=>0,'err'=>'登录状态异常.'));
			exit();
		}

		$order_id = intval($_REQUEST['order_id']);//订单id
		$pay_type = trim($_REQUEST['pay_type']);//支付类型
		$order = M('order')->where("id=".intval($order_id)." AND del=0")->find();
		if (!$order) {
			echo json_encode(array('status'=>0,'err'=>'订单信息错误.'));
			exit();
		}

		$order_sn = trim($order['order_sn']);//订单号

		$product=M('order_product')->where("`order_id`=".intval($order['id']))->field('name')->select();
		$body = '';
		foreach ($product as $key => $val) {
			if ($key==0) {
				$body .=$val['name'];
			}else{
				$body .=','.$val['name'];
			}
		}

		// 获取支付金额		
		$total = $order['price']*100;     // 转成分
		// 商品名称
		$subject = '小程序:'.$body;
		// 订单号，示例代码使用时间值作为唯一的订单ID号
		$out_trade_no = $order_sn;

		//获取用户openid
		//$tools = new \JsApiPay();
		$openId = M("user")->where("del=0 AND id=".$uid)->getField("openid");
		if(!$openId){
			echo json_encode(array('status'=>0,'err'=>'网络错误.'));
			exit();
		}
		//配置支付参数
		define( "_APPID",C("weixin.appid"));
		define( "_MCHID",C("weixin.mchid"));
		define( "_KEY", C("weixin.key"));
		define( "_APPSECRET", C("weixin.secret"));
		//统一下单
		$input = new \WxPayUnifiedOrder();
		$input->SetBody($body);                        //商品名称
		$input->SetAttach("小程序"); 
		$input->SetOut_trade_no($out_trade_no);  //订单号
		$input->SetTotal_fee($total);                       //订单总金额
		$input->SetTime_start(date("YmdHis"));           //订单生成时间
		$input->SetTime_expire(date("YmdHis", time() + 600)); //订单失效时间
		$input->SetGoods_tag('');                       //设置商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠
		$input->SetNotify_url($notify_url);             //异步通知地址
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order_data = \WxPayApi::unifiedOrder($input); 

		// foreach($order_data as $key=>$value){
	 //        echo "<font color='#00ff55;'>$key</font> : $value <br/>";
	 //    }
		//{"appid":"wx0411fa6a39d61297","noncestr":"3reA4pSqGBPPryEL","package":"Sign=WXPay","partnerid":"1230636401","prepayid":"wx20170406175858b261288c050041764688","timestamp":1491472738,"sign":"4A50B67D47E062A1F3B739D76C683D37"}	
		//{"appid":"wx05a63e391546d945","noncestr":"Uvxaj0yZeE5uw0Wd","package":"Sign=WXPay","partnerid":"1460680002","prepayid":"wx201704221807041af49e25c90779187614","timestamp":1492855550,"sign":"08FB66188544D438DF074F815EB585DF"} 	
		$array=array(
			"appId"	   =>$order_data['appid'],
			"timeStamp"=>(string)time(),
			"nonceStr" =>$order_data['nonce_str'],
			"package"  =>"prepay_id=".$order_data['prepay_id'],
			"signType" =>"MD5",
		);
		$str = 'appId='.$array['appId'].'&nonceStr='.$array['nonceStr'].'&package='.$array['package'].'&signType=MD5&timeStamp='.$array['timeStamp'];
		//重新生成签名
		$array['paySign']=strtoupper(md5($str.'&key='.\WxPayConfig::KEY));
	
		echo json_encode(array('status'=>1,'success'=>$array));
		//exit();

    }
    /**
     * [wxnotifyurl 微信支付异步通知]
     * @return [type] [description]
     */
    public function wxnotifyurl(){
    	vendor("wxpay.wxpay");
    	$xml = file_get_contents('php://input');
    	$arr = json_decode(json_encode(simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA)), true);
    	//将支付的记录用txt的形式记录起来，文件夹自动创建，方便管理
		$dir='Data/Jsondata/paylog/'.date("Ym").'/'.date("d");
		if(!is_dir($dir)){
		  mkdir($dir,0777,1);
		}
		$file=$dir."/wxpaylog.txt";
		$content="【".date("H:i:s",time())."】=>".$arr['out_trade_no']." >>".$arr['result_code']."<<\n".json_encode($arr)."\n";
		//将记录写进记录文件，有则追加，没有则新建文件。
	    file_put_contents($file,$content,FILE_APPEND);
  		
        //获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
		$out_trade_no   = $arr['out_trade_no'];      //商户订单号
		$trade_no       = $arr['transaction_id'];          //支付宝交易号
		$trade_status   = $arr['result_code'];      //交易状态
		$total_fee      = $arr['total_fee'];         //交易金额
		$notify_time    = strtotime($arr['time_end']); //通知的发送时间。格式为yyyy-MM-dd HH:mm:ss。
		$buyer_email    = $arr['buyer_email'];       //买家支付宝帐号；
        $parameter = array(
			"trade_no"      => $trade_no,     //支付宝交易号；
			"status"=>20,
		);
		if($arr['result_code'] == 'SUCCESS') {
			//更新订单状态
			$order=M('order');
            $re=$order->where('order_sn="'.trim($arr['out_trade_no']).'"')->save($parameter);
            if($re){
            	//产品销量+1
            	$orderid=$order->where('order_sn="'.trim($arr['out_trade_no']).'"')->getField("id");
            	$order_pro=M("order_product")->where("order_id=".$orderid)->getField("pid");
            	if($order_pro){
            		M("product")->where("id=".$order_pro)->setInc("shiyong",1);
            	}
            	//返回xml格式的通知回去
            	$return = array('return_code'=>'SUCCESS','return_msg'=>'OK');
		        $re_xml = '<xml>';
		        foreach($return as $k=>$v){
		            $re_xml.='<'.$k.'><![CDATA['.$v.']]></'.$k.'>';
		        }
		        $re_xml.='</xml>';

		        echo $re_xml;
            }else{
            	echo "fail";
            }
		}else{
			echo "fail";
		}
    }
	
}
?>